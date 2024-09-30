import { CardFooter } from "./ui/card";

export default function Pagination() {
  return (
    <CardFooter className="flex-wrap p-4 justify-between gap-3 text-gray-500">
      <button className="p-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
        prev
      </button>

      <div className="flex items-center gap-2 text-sm">
        <button className="px-2 rounded-sm bg-skyBlue">1</button>
        <button className="px-2 rounded-sm">2</button>
        <button className="px-2 rounded-sm">3</button>
        ...
        <button className="px-2 rounded-sm">10</button>
      </div>

      <button className="p-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
        next
      </button>
    </CardFooter>
  );
}
