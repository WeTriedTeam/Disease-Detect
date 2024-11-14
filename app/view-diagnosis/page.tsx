import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

// Async fetch diagnosis records
async function fetchRecords() {
  const res = await fetch("http://localhost:3001/records", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch records");
  }

  return res.json();
}

export default async function ViewDiagnosis() {
  const diagnosisRecords = await fetchRecords();

  return (
    <>
      <Table>
        <TableCaption>A list of your recent diagnosis.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Diagnosis Note</TableHead>
            <TableHead className="text-right">Detail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {diagnosisRecords?.map((item: any) => (
            <TableRow key={item.diagnosis_id}>
              <TableCell className="font-medium">
                {item.date ? item.date : "N/A"}
              </TableCell>
              <TableCell>
                {item.patient.firstname} {item.patient.lastname}
              </TableCell>
              <TableCell>{item.diagnosis_note}</TableCell>
              <TableCell className="text-right">
                <Link href={`/view-diagnosis/${item.diagnosis_id}`}>
                  Detail
                </Link>
              </TableCell>{" "}
              {/* <Link href={`/view-diagnosis/${0}`}>Detail</Link>*/}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
