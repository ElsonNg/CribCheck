
interface ReportCriteriaRatingProps {
    label: String;
    stars: number;
}


export default function ReportCriteriaRating({ label, stars }: ReportCriteriaRatingProps) {

    return (<div className="flex flex-col justify-center items-start">
        <h6 className="font-medium">{label}</h6>
        <div className="flex flex-row justify-start gap">
            {Array.from({ length: stars }, (_, i) => i + 1).map(star => <span key={star} className="text-yellow-500">⭐</span>)}
        </div>
    </div>)
}