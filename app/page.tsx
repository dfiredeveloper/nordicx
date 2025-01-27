import NewPage from "@/components/chain/newPair";
import { Suspense } from 'react'
export default function Home() {
  return (
    <div className="">
      <Suspense>
        <NewPage />
      </Suspense>
    </div>
  );
}
