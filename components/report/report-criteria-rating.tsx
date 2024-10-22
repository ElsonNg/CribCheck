import { FaStar } from "react-icons/fa6";

interface ReportCriteriaRatingProps {
    label: string;
    stars: number;
}


export default function ReportCriteriaRating({ label, stars }: ReportCriteriaRatingProps) {

    return (<div className="flex flex-col gap-2 justify-center items-start">
        <h5 className="text-lg font-medium">{label}</h5>
        <div className="flex flex-row justify-start gap-2">
            {Array.from({ length: stars }, (_, i) => i + 1).map(star => <span key={star} className="text-yellow-400 text-2xl"><FaStar/></span>)}
        </div>
    </div>)
}