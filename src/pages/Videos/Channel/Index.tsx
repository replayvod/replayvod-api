import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApiRoutes, Pathnames, getApiRoute } from "../../../type/routes";
import { Link } from "react-router-dom";
import { Channel, Stream } from "../../../type";
import DropdownButton from "../../../components/UI/Button/ButtonDropdown";

const ChannelPage: React.FC = () => {
    const { t } = useTranslation();
    const [channels, setChannels] = useState<Channel[]>([]);
    const [streams, setStreams] = useState<Stream[]>([]);
    const [order, setOrder] = useState(t("Channel (ascending)"));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchData = async () => {
        const urlFollowedChannels = getApiRoute(ApiRoutes.GET_USER_FOLLOWED_CHANNELS);
        const urlFollowedStreams = getApiRoute(ApiRoutes.GET_USER_FOLLOWED_STREAMS);
        try {
            const [followedChannelsResponse, followedStreamsResponse] = await Promise.all([
                fetch(urlFollowedChannels, { credentials: "include" }),
                fetch(urlFollowedStreams, { credentials: "include" }),
            ]);

            if (!followedChannelsResponse.ok || !followedStreamsResponse.ok) {
                throw new Error("HTTP error");
            }

            const [followedChannelsData, followedStreamsData] = await Promise.all([
                followedChannelsResponse.json(),
                followedStreamsResponse.json(),
            ]);

            const sortedChannels = sortChannels(followedChannelsData, order);
            setChannels(sortedChannels);
            setStreams(followedStreamsData);
            setIsLoading(false);
        } catch (error) {
            console.error("Error:", error);
            setIsLoading(false);
        }
    };

    const sortChannels = (channels: Channel[], order: string) => {
        console.log(order);
        if (order === t("Channel (descending)")) {
            return [...channels].sort((b, a) => a.broadcasterName.localeCompare(b.broadcasterName));
        } else {
            return [...channels].sort((a, b) => a.broadcasterName.localeCompare(b.broadcasterName));
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 3000);
        return () => clearInterval(intervalId);
    }, [order]);

    const handleOrderSelected = (value: string) => {
        setOrder(value);
    };

    if (isLoading) {
        return <div>{t("Loading")}</div>;
    }

    return (
        <div className="p-4">
            <div className="p-4 mt-14">
                <h1 className="text-3xl font-bold pb-5 dark:text-stone-100">{t("Channels")}</h1>
                <div className="flex mb-4 items-center justify-end space-x-5">
                    <div className="space-x-2">
                        <DropdownButton
                            label={t(order)}
                            options={[t("Channel (ascending)"), t("Channel (descending)")]}
                            onOptionSelected={handleOrderSelected}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
                    {channels.map((channel) => {
                        const isLive = streams.some(
                            (stream) => stream.broadcasterId === channel.broadcasterId && stream.type === "live"
                        );

                        return (
                            <Link
                                to={`${Pathnames.Video.Channel}/${channel.broadcasterLogin}`}
                                className={`bg-zinc-100 dark:bg-gray-800 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                    isLive ? "relative" : ""
                                }`}
                                key={channel.broadcasterId}>
                                <div className="flex">
                                    <img
                                        className="w-10 h-10 rounded-full"
                                        src={channel.profilePicture}
                                        alt="Profile Picture"
                                    />
                                    <h2 className="flex dark:text-stone-100 items-center px-3">
                                        {channel.broadcasterName}
                                    </h2>
                                    {isLive && (
                                        <div className="m-auto ml-0 w-4 h-4 bg-red-500 rounded-full align-center"></div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
export default ChannelPage;
