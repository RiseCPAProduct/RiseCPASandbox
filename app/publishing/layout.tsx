import { PublishingNav } from "../components/publishing/shared"; 

// Publishing tab: the one sanctioned path into the Published folder
// (Submit -> Partner approval -> Publish).
export default function PublishingLayout({ children }: LayoutProps<"/publishing">) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-3xl font-bold text-brand-charcoal">Publishing</h1>
        <p className="mt-1 text-brand-charcoal">
          Submit a draft or idea, partners approve it, and a publisher files it with the right name, folder and audience.
        </p>
      </div>
      <PublishingNav />
      {children}
    </div>
  );
}
