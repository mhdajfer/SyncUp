import { Button } from "@/Components/ui/button";
import { FileX } from "lucide-react";

export default function NoData() {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] bg-muted/30 rounded-lg p-6 text-center border border-slate-700 text-slate-400 text-xs font-light">
      <div className="flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
        <FileX className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-slate-200">
        No data available
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        It looks like there is no data to display at the moment. Start by adding
        some new items to see them appear here.
      </p>
      <Button className="inline-flex items-center">Reach out to admin!</Button>
    </div>
  );
}
