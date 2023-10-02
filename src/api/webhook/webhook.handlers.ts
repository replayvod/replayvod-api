import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import * as webhookService from "./webhook";
import { Webhook } from "../../models/webhookModel";
import {
    CHANNEL_UPDATE,
    HMAC_PREFIX,
    MESSAGE_TYPE,
    MESSAGE_TYPE_NOTIFICATION,
    MESSAGE_TYPE_REVOCATION,
    MESSAGE_TYPE_VERIFICATION,
    STREAM_OFFLINE,
    STREAM_ONLINE,
    TWITCH_MESSAGE_SIGNATURE,
    TwitchHeaders,
} from "../../constants/twitchConstants";
import { logger } from "../../app";
import { NotificationBody, SubscriptionType } from "../../models/notificationTwitch";

interface WebhookRequest extends RouteGenericInterface {
    Body: Webhook;
    Headers: TwitchHeaders;
}

export const addWebhook = async (req: FastifyRequest<WebhookRequest>, reply: FastifyReply) => {
    try {
        const webhook: Webhook = { id: req.body.id, url: req.body.url } as Webhook;
        const addedWebhook = await webhookService.addWebhook(webhook);
        reply.status(200).send({ data: addedWebhook });
    } catch (error) {
        reply.status(500).send({ error: "Internal Server Error" });
    }
};

export const removeWebhook = async (req: FastifyRequest<WebhookRequest>, reply: FastifyReply) => {
    try {
        const removedWebhook = await webhookService.removeWebhook(req.body.id);
        if (removedWebhook) {
            reply.status(200).send({ data: removedWebhook });
        } else {
            reply.status(404).send({ error: "Webhook not found" });
        }
    } catch (error) {
        reply.status(500).send({ error: "Internal Server Error" });
    }
};

export const callbackWebhook = async (req: FastifyRequest<WebhookRequest>, reply: FastifyReply) => {
    let secret = webhookService.getSecret();
    let message = webhookService.getHmacMessage(req);
    let hmac = HMAC_PREFIX + webhookService.getHmac(secret, message);

    let signature = req.headers[TWITCH_MESSAGE_SIGNATURE];
    if (typeof signature !== "string") {
        reply.status(400).send();
        return;
    }

    if (webhookService.verifyMessage(hmac, signature) === true) {
        logger.info("[webhookEventLogger] signatures match");
        let notification: NotificationBody = req.body;
        let messageType = req.headers[MESSAGE_TYPE];
        let response;
        logger.info("messageType");
        if (MESSAGE_TYPE_NOTIFICATION === messageType) {
            switch (notification.subscription.type) {
                case SubscriptionType.CHANNEL_UPDATE:
                    response = webhookService.handleChannelUpdate(notification);
                    break;
                case SubscriptionType.STREAM_ONLINE:
                    response = webhookService.handleStreamOnline(notification);
                    break;
                case SubscriptionType.STREAM_OFFLINE:
                    response = webhookService.handleStreamOffline(notification);
                    break;
                default:
                    response = webhookService.handleNotification(notification);
                    break;
            }
        } else if (MESSAGE_TYPE_VERIFICATION === messageType) {
            response = webhookService.handleVerification(notification);
        } else if (MESSAGE_TYPE_REVOCATION === messageType) {
            response = webhookService.handleRevocation(notification);
        } else {
            reply.status(400).send();
            return;
        }
        reply.status(response.status);
        if (response.body) {
            reply.send(response.body);
        } else {
            reply.send();
        }
    } else {
        reply.status(403).send();
    }
};