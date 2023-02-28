import Link from "next/link";
import React, {
  useState,
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
} from "react";
import { BsSearch, BsClockHistory, BsMenuApp } from "react-icons/bs";
import { GrLogout } from "react-icons/gr";
import { MdExpandMore, MdMenu } from "react-icons/md";

import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";

type CategoriesProps = {
  id: string;
  category: string;
  slug: string;
};

type PartialProps = {
  categoriesData: CategoriesProps[];
};

const NavBar = () => {
  const { currentUser, logout } = useContext(AuthContext);

  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

  const router = useRouter();

  const [categoriesData, setCategoriesData] = useState<CategoriesProps[]>([]);

  useEffect(() => {
    const unsubscribe = async () => {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const data: CategoriesProps[] = [];
      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id as string,
          category: doc.data().category,
          slug: doc.data().slug,
        });
      });
      return setCategoriesData(data);
    };

    return () => {
      unsubscribe();
    };
  }, []);

  const NavBarUpper = ({ categoriesData }: PartialProps) => {
    const [search, setSearch] = useState<string>("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearch(e?.currentTarget.value);
    };

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      router.push(`/search?search=${search}`);
    };

    return (
      <>
        <div className="w-full h-20 flex items-center justify-between gap-3 px-5 py-2 z-50">
          <Link href="/">
            <h1 className="text-3xl md:block hidden font-bold text-white">
              GENFIG
            </h1>
            <h1 className="text-3xl md:hidden block font-bold text-white">G</h1>
          </Link>

          <div className="grow h-full gap-3 flex items-center">
            <form
              onSubmit={handleSearch}
              className="lg:w-1/2 w-full h-5/6 bg-white rounded-full flex items-center justify-between overflow-hidden gap-2 p-3"
            >
              <input
                onChange={handleChange}
                placeholder="Bạn muốn tìm món gì ..."
                className="w-11/12 h-full md:text-lg text-sm border-none focus:outline-none font-light"
              />
              <BsSearch type="submit" className="w-8 md:text-3xl text-xl" />
            </form>
          </div>

          <MdMenu
            className="md:hidden block text-white text-3xl cursor-pointer"
            onClick={() => setOpenMobileMenu(!openMobileMenu)}
          />

          {currentUser?.displayName ? (
            <UserDropdown />
          ) : (
            <button
              onClick={() => router.push("/auth/login")}
              className="md:flex hidden items-end justify-end w-60 text-white"
            >
              Đăng nhập
            </button>
          )}
        </div>
        <MobileMenu
          isOpen={openMobileMenu}
          setIsOpen={setOpenMobileMenu}
          categoriesData={categoriesData}
        />
      </>
    );
  };

  const NavBarLower = ({ categoriesData }: PartialProps) => {
    const router = useRouter();

    const navLinks = [
      {
        label: "Trang chủ",
        destination: "/",
      },
      {
        label: "Về chúng tôi",
        destination: "/about",
      },
      {
        label: "Ưu đãi",
        destination: "/promotion",
      },
    ];

    return (
      <div className="w-full h-12 md:flex hidden items-center gap-10 text-white px-5">
        <ProductListDropdown categoriesData={categoriesData} />
        {navLinks.map((nav, index) => (
          <Link
            key={index}
            href={nav.destination}
            className={`text-sm cursor-pointer hover:underline font-extralight underline-offset-8 hover:text-amber-300 ${
              router.pathname === nav.destination &&
              "text-amber-300 underline cursor-default pointer-events-none"
            }`}
          >
            {nav.label}
          </Link>
        ))}
      </div>
    );
  };

  const ProductListDropdown = ({ categoriesData }: PartialProps) => {
    return (
      <div className="flex group flex-col items-end justify-end w-60 relative">
        <button className="flex items-center justify-between w-60 h-12 bg-cyan-400 px-3 cursor-pointer">
          <BsMenuApp />
          <p className="text-sm ">DANH MỤC SẢN PHẨM</p>
          <MdExpandMore className="text-sm group-hover:rotate-180" />
        </button>

        <ul
          id="dropdown"
          className="z-10 absolute text-sm hidden group-hover:block group-hover text-gray-700 top-full left-0 bg-white divide-y divide-gray-500 shadow-2xl w-60"
        >
          <li>
            <Link
              href="/collection"
              className="block px-4 py-2 hover:bg-gray-100 truncate "
            >
              Tất cả sản phẩm
            </Link>

            {categoriesData?.map((category) => (
              <Link
                key={category.id}
                href={`/collection/${category.slug}`}
                className="block px-4 py-2 hover:bg-gray-100 truncate "
              >
                {category.category}
              </Link>
            ))}
          </li>
        </ul>
      </div>
    );
  };

  const UserDropdown = () => {
    const handleLogout = () => {
      logout?.();
    };

    return (
      <div className="md:flex hidden group flex-col items-end justify-end w-60 relative">
        <button
          className="text-white bg-transparent focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          <h1 className="text-sm font-bold truncate">
            {currentUser?.displayName}
          </h1>
          <MdExpandMore className="text-lg group-hover:rotate-180" />
        </button>

        <ul
          id="dropdown"
          className="z-10 group-hover:block hidden absolute top-full rounded-lg overflow-hidden text-sm text-gray-700 bg-white divide-y divide-gray-300 shadow-2xl w-72 dark:bg-gray-700"
        >
          <li>
            <Link href="/me" className="block px-4 py-2 hover:bg-gray-100  ">
              <p className="text-sm italic">Tài khoản:</p>
              <p className="text-lg font-bold">{currentUser?.email}</p>
            </Link>
          </li>
          <li>
            <Link
              href="/history"
              className="px-4 py-2 hover:bg-gray-100 flex item-center gap-3"
            >
              <BsClockHistory />
              Lịch sử mua hàng
            </Link>
          </li>

          <li>
            <div
              onClick={handleLogout}
              className="px-4 py-2 hover:bg-gray-100 flex item-center gap-3"
            >
              <GrLogout />
              Đăng xuất
            </div>
          </li>
        </ul>
      </div>
    );
  };

  type MobileMenuProps = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    categoriesData: CategoriesProps[];
  };

  const MobileMenu = ({
    isOpen,
    setIsOpen,
    categoriesData,
  }: MobileMenuProps) => {
    const [openProfileList, setOpenProfileList] = useState<boolean>(false);

    const [openProductList, setOpenProductList] = useState<boolean>(false);

    const { currentUser, logout } = useContext(AuthContext);

    const menuRef = useRef<HTMLDivElement>(null);

    const spaceRef = useRef<HTMLDivElement>(null);

    const handleCloseMenu = (e: React.MouseEvent) => {
      if (e.target === spaceRef.current) setIsOpen(false);
    };

    return (
      <div
        ref={spaceRef}
        onClick={handleCloseMenu}
        className={`w-full h-[calc(100vh-5rem)] absolute top-20  right-0 md:hidden bg-black/40 ${
          isOpen ? "flex justify-end" : "hidden"
        }`}
      >
        <div
          ref={menuRef}
          className={`w-3/4 sm:w-1/2 z-30 bg-white divide-y flex flex-col overflow-y-auto ${
            isOpen ? "animate-openMenu" : "animate-closeMenu"
          }`}
        >
          {currentUser ? (
            <div
              onClick={() => setOpenProfileList(!openProfileList)}
              className="w-full text-sm font-bold flex gap-2 items-center justify-end px-5 py-2"
            >
              <p className="truncate">{currentUser?.displayName}</p>
              <MdExpandMore
                className={`${openProfileList ? "rotate-0" : "rotate-180"}`}
              />
            </div>
          ) : (
            <Link
              className="w-full text-sm font-bold flex gap-2 items-center justify-end px-5 py-2"
              onClick={() => setIsOpen(false)}
              href="/auth/login"
            >
              Đăng nhập
            </Link>
          )}

          <div
            className={`w-full text-sm font-bold flex-col gap-2 items-center justify-end px-5 py-2 ${
              openProfileList ? "flex" : "hidden"
            }`}
          >
            <Link className="px-5 py-1" onClick={() => setIsOpen(false)} href="/me">
              Quản lý tài khoản
            </Link>
            <Link className="px-5 py-1" onClick={() => setIsOpen(false)} href="/history">
              Lịch sử giao dịch
            </Link>
            <div className="px-5 py-1" onClick={() => logout?.()}>Đăng xuất</div>
          </div>

          <Link
            onClick={() => setIsOpen(false)}
            href="/"
            className="w-full text-sm font-bold flex gap-2 items-center justify-end px-5 py-2"
          >
            <p className="truncate">Trang chủ</p>
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            href="/about"
            className="w-full text-sm font-bold flex gap-2 items-center justify-end px-5 py-2"
          >
            <p className="truncate">Về chúng tôi</p>
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            href="/promotion"
            className="w-full text-sm font-bold flex gap-2 items-center justify-end px-5 py-2"
          >
            <p className="truncate">Ưu đãi</p>
          </Link>

          <div
            onClick={() => setOpenProductList(!openProductList)}
            className="w-full text-sm font-bold flex gap-2 items-center justify-end px-5 py-2"
          >
            <p className="truncate">SẢN PHẨM</p>
            <MdExpandMore
              className={`${openProductList ? "rotate-0" : "rotate-180"}`}
            />
          </div>

          <div
            className={`w-full text-sm font-bold flex-col gap-2 items-center justify-end px-5 py-2 ${
              openProductList ? "flex" : "hidden"
            }`}
          >
            <Link onClick={() => setIsOpen(false)} href="/collection">
              Tất cả sản phẩm
            </Link>
            {categoriesData.map((category) => (
              <Link
                className="px-5 py-1"
                onClick={() => setIsOpen(false)}
                key={category.id}
                href={`/collection/${category.slug}`}
              >
                {category.category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <nav className="z-30 sticky top-0 flex flex-col gap-2 bg-black">
      <NavBarUpper categoriesData={categoriesData} />
      <NavBarLower categoriesData={categoriesData} />
    </nav>
  );
};

export default NavBar;
