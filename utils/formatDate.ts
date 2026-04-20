export function formatTimeLeft(dateString: string): string{
    const target = new Date(dateString).getTime();
    const now = Date.now();

    const diffMs = target - now;

    if(Number.isNaN(target)) return "Invalid date";
    if(diffMs <=0) return "Expired";

    const totalMinutes = Math.floor(diffMs /(1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes %(60*24)) /60);
    const minutes = totalMinutes % 60;

    if(days > 0) return `${days}d ${hours}h left`;
    if(hours>0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
}

export function formatPickupWindow(start?: string | null, end?: string | null):string{
    if(!start || !end) return "Pickup time not specified";

    const startDate = new Date(start);
    const endDate = new Date(end);

    if(Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        return "Pickup time not specified";
    }

    const formatter = new Intl.DateTimeFormat("en-GB",{
        hour:"2-digit",
        minute:"2-digit",
    });

    return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
}