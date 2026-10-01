import Logo from '../Logo';


export default function AuthNavbar({isExternalPage=false}) {
  // const dispatch = useDispatch<AppDispatch>()
  // const { user } = useSelector((state: RootState) => state.auth)
  // const { breadcrumb } = useSelector((state: RootState) => state.general)

  // const [dropdownOpen, setDropdownOpen] = useState(false);
  // const dropdownRef = useRef<HTMLDivElement>(null);

  // // Close dropdown when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
  //       setDropdownOpen(false);
  //     }
  //   };

  //   document.addEventListener('click', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, []);

  return (
    <header className="bg-background w-full border-b border-primary/10 backdrop-blur supports-backdrop-filter:bg-white/60 sticky top-0 z-50">
      <div className="mx-auto max-md:px-12 px-[120px] py-4 flex items-center justify-between">
        <div className='flex items-center gap-4'>
          <Logo/>
        </div>
      </div>
    </header>
  );
}
