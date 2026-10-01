import LinkButton from "@/components/shared/button/LinkButton";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-center px-4">
      <div>
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="mt-4 text-lg">Oops! Page not found.</p>
        <p className="text-sm text-grey mt-2">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <LinkButton
          to="/"
          size='lg'
          variant='primary'
          className="font-bold mt-6"
        >
          <ArrowLeftCircle className='h-6 w-6 mr-5'/>
          Back to Home
        </LinkButton>
      </div>
    </div>
  )
}
