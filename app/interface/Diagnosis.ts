import { BoundingBox } from "./BoundingBox"

export interface Diagnosis{
    diagnosis_id: string,
    patient_id: string,
    patient_first_name: string,
    patient_last_name: string,
    diagnosis_date: Date,
    photo_path: string,
    nodule_position: BoundingBox[]
}