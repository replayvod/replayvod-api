import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TableEvents from "../../components/TableEvents";
import { EventLog } from "../../type";

const Events: React.FC = () => {
    const { t } = useTranslation();
    const [logs, setLogs] = useState<EventLog[]>([]);
    const ROOT_URL = import.meta.env.VITE_ROOTURL;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${ROOT_URL}/api/log/domains`, {
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setLogs(data);
            setIsLoading(false);
        };

        fetchData();
        const intervalId = setInterval(fetchData, 10000);

        return () => clearInterval(intervalId);
    }, []);
    return (
        <div className="p-4">
            <div className="p-4 mt-14">
                <h1 className="text-3xl font-bold pb-5 dark:text-stone-100">{t("Log Files")}</h1>
            </div>
            {isLoading ? <div>{t("Loading")}</div> : <TableEvents items={logs} />}
        </div>
    );
};

export default Events;
