import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormVote from "./_components/form";

export default function CreatePage() {
  return (
    <div className="p-5 gap-5 space-y-5 max-w-screen-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Event Vote</CardTitle>
          <CardDescription>Form create event vote</CardDescription>
        </CardHeader>
        <CardContent>
          <FormVote />
        </CardContent>
      </Card>
    </div>
  );
}
