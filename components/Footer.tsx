import React from "react";
import { BsFacebook, BsMailbox, BsPhone } from "react-icons/bs";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className="w-full md:h-72 h-12">
      <div className="w-full h-5/6 md:grid grid-cols-3 hidden bg-zinc-800 px-10 py-5 gap-3">
        <div className="w-full px-3">
          <h1 className="text-xl font-bold text-white">Địa chỉ:</h1>
          <p className="text-sm font-extralight text-white">
            123 đường Hai Bà Trưng, quận 1, TPHCM
          </p>
        </div>
        <div className="w-full px-3">
          <h1 className="text-xl text-white">Bản đồ:</h1>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4031683915546!2d106.69819691460592!3d10.780401492318822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f482f0e257f%3A0x42ddb376aafd6e42!2zMTIzIEhhaSBCw6AgVHLGsG5nLCBC4bq_biBOZ2jDqSwgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCA3MDAwMDAsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1675797798489!5m2!1svi!2s"
            className="w-full h-5/6 rounded-lg"
            loading="lazy"
          ></iframe>
        </div>
        <div className="w-full flex flex-col gap-2 justify-between">
          <h1 className="text-xl text-white flex">Liên hệ:</h1>
          <a href="tel:0768985564" className="flex items-center gap-2">
            <BsPhone className="text-2xl text-white" />
            <p className="texl-xl font-extralight text-white">0768985564</p>
          </a>

          <a
            href="mailto:nqdathcmpro1@gmail.com"
            className="flex items-center gap-2"
          >
            <BsMailbox className="text-2xl text-white" />
            <p className="texl-xl font-extralight text-white">
              nqdathcmpro1@gmail.com
            </p>
          </a>

          <a href="https://www.facebook.com/profile.php?id=100006486103213" className="flex items-center gap-2">
            <BsFacebook className="text-2xl text-white" />
            <p className="texl-xl font-extralight text-white">Đạt Feed</p>
          </a>
        </div>
      </div>
      <div className="w-full md:h-1/6 h-full grid place-items-center bg-black">
        <h3 className="text-sm text-white text-center">
          Copyrighted 2023 by GenFig. All rights reserved.
        </h3>
      </div>
    </div>
  );
};

export default Footer;
