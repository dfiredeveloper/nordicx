import TableBody from "./body";
import Colgroup from "./colgroup";


export default function Table() {
    return (
        <div className='w-full md:px-[1.3rem] h-[781px] gap-5 overflow-y-auto relative pb-[50px]'>
            <div className="relative overflow-auto h-full">
                <table className="bg-accent-2">
                    <Colgroup />
                    <TableBody />
                </table>
            </div>
        </div >
    )
}
