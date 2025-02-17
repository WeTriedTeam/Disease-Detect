export interface BoundingBox{
     id?: string;
     classId: number;
     className: string;
     bbox: number[];
     confidence: number;
     xCenter: number;
     yCenter: number;
     width: number;
     height: number;
     isTemp: boolean;
     severity: string;
     notes: string;
}