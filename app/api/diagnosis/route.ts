import { NextResponse } from "next/server";

const DiagnosisRecords = [
  {
    id: 0,
    patientName: "John Doe",
    diagnosisNote: "Lung Problem",
    date: "15/10/2024",
    imgRef:
      "https://images.deepai.org/converted-papers/2301.02166/figures/Pred_figure_1.png",
  },
  {
    id: 1,
    patientName: "Jane Doe",
    diagnosisNote: "Lung Problem",
    date: "14/10/2024",
    imgRef:
      "https://images.deepai.org/converted-papers/2301.02166/figures/Pred_figure_1.png",
  },
  {
    id: 2,
    patientName: "Go Doe",
    diagnosisNote: "Lung Problem",
    date: "13/10/2024",
    imgRef:
      "https://images.deepai.org/converted-papers/2301.02166/figures/Pred_figure_1.png",
  },
];

//   Get /api/diagnosis-records
export async function GET() {
  return NextResponse.json(DiagnosisRecords);
}
