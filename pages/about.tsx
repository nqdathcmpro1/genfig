import HeadContainer from "@/components/Head";
import React from "react";

type Props = {};

const About = (props: Props) => {
  return (
    <>
    <HeadContainer>Về chúng tôi</HeadContainer>
    <div className="w-full flex flex-col items-center gap-3">
      <h1 className="w-full text-center text-4xl font-bold md:text-7xl">
        Về chúng tôi
      </h1>

      <p className="w-full text-lg md:text-xl">
        GenFig được thành lập vào năm 2023, từ những con người có cùng đam mê
        tựa game Genshin Impact, cũng như đam mê về figure đã làm nên thương
        hiệu GenFig- Genshin Figure. Với niềm mong muốn mang đến niềm vui cho
        các bạn trẻ thích sưu tập figure nói chung, hay figure Genshin Impact
        nói riêng, chúng tôi hứa sẽ mang lại chất lượng sản phẩm tốt nhất và sự
        phục vụ chu đáo, tận tình nhất.
      </p>

      <img
        className="w-full md:w-1/2"
        src="https://i.etsystatic.com/35786495/r/il/0cbd54/4012785026/il_794xN.4012785026_c6fr.jpg"
      />

      <h1 className="w-full text-center text-4xl font-bold md:text-7xl">
        Về sản phẩm
      </h1>

      <p className="w-full text-lg md:text-xl">
        GenFig luôn luôn lựa chọn các sản phẩm có chất lượng tốt nhất, đến từ
        các nhãn hàng uy tín như: miHoYo, Figuarts, Apex, ... Đặc biệt, chúng
        tôi luôn luôn nói không với các loại hàng giả, hàng nhái, hàng replica
        1:1 trôi nổi trên thị trường, để không mang lại những trải nghiệm mua
        hàng không tốt đến từ GenFig. Ngoài ra, các mặt hàng cũng được phân phối
        đa dạng, phù hợp với nhiều tập đối tượng khách hàng khác nhau.
      </p>

      <span className="w-full text-lg md:text-xl">
        Ngoài Figure là mặt hàng chủ đạo cùa GenFig, chúng tôi còn có các sản
        phẩm như:
        <li>Acrylic Standee</li>
        <li>Vỏ gối ôm</li>
        <li>Artbook</li>
        <li>Cùng một số mặt hàng thú vị khác ...</li>
      </span>

      <img
        className="w-full md:w-1/2"
        src="https://bbts1.azureedge.net/images/p/full/2022/09/77e6e0a1-e9ae-45b3-8108-b2fab5718681.jpg"
      />

      <h1 className="w-full text-center text-4xl font-bold md:text-7xl">
        Về phục vụ
      </h1>

      <p className="w-full text-lg md:text-xl">
        GenFig chính thức hoạt động mua bán từ 8h-20h hằng ngày (trừ các ngày
        Lễ, Tết). Kênh bảo hành sẽ hoạt động xuyên suốt 24/24 với bất cứ trường
        hợp hư hỏng hàng đến từ nhà sản xuất. GenFig chỉ phục vụ trên các nền
        tảng trực tuyến như: Website GenFig.com, Facebook, Gmail, hay số điện
        thoại cùa GenFig, ngoài ra chỉ cung cấp địa chỉ trực tiếp trong các
        trường hợp đổi trả sản phẩm.{" "}
      </p>

      <img
        className="w-full md:w-1/2"
        src="https://bbts1.azureedge.net/images/p/full/2021/04/c58b7092-67e8-4d67-8fc0-1f49192de07b.jpg"
      />

      <h1 className="w-full text-center text-4xl font-bold md:text-7xl">
        Review
      </h1>

      <div className="w-10/12 bg-amber-100 rounded-xl text-lg md:text-xl flex flex-col md:flex-row justify-between gap-5 p-10">
        <img
          className="w-full md:w-1/2"
          src="https://i.ytimg.com/vi/7MHGZRzrvGU/hqdefault.jpg"
        />
        <div className="w-full md:w-1/2">
          <p className="w-full">
            Tôi là một người chơi Genshin Impact kì cựu và tôi rất thích sưu tập
            các figure về các nhân vật mà tôi yêu thích. Và GenFig luôn luôn là
            lựa chọn hàng đầu của tôi. Tại đây bán rất nhiều mặt hàng mà tôi ưa thích,
            với chất lượng rất tốt mà chính tôi có thề đảm bảo. Mọi người nếu có
            niềm đam mê như tôi, hãy lựa chọn GenFig. Siuuuuuuu !
          </p>
          <p className="w-full font-bold">- Cristiano Ronaldo -</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default About;
