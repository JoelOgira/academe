import prisma from "@/lib/prisma";

export default async function EventList({
  dateParam,
}: {
  dateParam: string | undefined;
}) {
  const date = dateParam ? new Date(dateParam) : new Date();

  const data = await prisma.event.findMany({
    where: {
      startTime: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });

  return data.map((event) => (
    <div
      className="flex flex-col gap-2 p-3 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-skyBlue even:border-t-skyPurple"
      key={event.id}
    >
      <div className="flex items-center justify-between gap-x-4">
        <h3 className="font-semibold text-gray-600 text-sm">{event.title}</h3>
        <span className="block text-xs text-gray-400">
          {event.startTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })} - {event.endTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>
      </div>
      <p className="text-muted-foreground text-sm">{event.description}</p>
    </div>
  ));
}
