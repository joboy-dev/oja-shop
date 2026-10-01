import { Code2 } from 'lucide-react';
import Link from 'next/link';
import ImageComponent from './Image';

function Logo({isCollapsed=false}: {isCollapsed?: boolean}) {
  return (
    <Link href="/" className="flex items-center">
      <ImageComponent
        src='/images/logo-no-bg.jpg'
        alt='MedStaq'
        width={50}
        objectFit='fill'
      />
      {!isCollapsed && <div className='ml-4'>
        <p className="text-xl font-bold text-foreground">Medstaq</p>
        {/* <p className="font-normal text-foreground">Technologies</p> */}
      </div> }
    </Link>
  )
}

export default Logo