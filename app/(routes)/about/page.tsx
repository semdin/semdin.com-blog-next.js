import dynamic from "next/dynamic";
import PDFViewer from "@/components/About/PDFViewer";

export default async function Page() {
  return (
    <div>
      <h1>About</h1>
      <PDFViewer />
    </div>
  );
}
