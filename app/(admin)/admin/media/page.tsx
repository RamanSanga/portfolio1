import { MediaUploader } from "@/components/admin/media-uploader";

export default function AdminMediaPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Media Manager</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Upload assets through signed Cloudinary requests and use returned URLs/public IDs in CMS forms.
      </p>

      <div className="mt-6">
        <MediaUploader />
      </div>
    </div>
  );
}
