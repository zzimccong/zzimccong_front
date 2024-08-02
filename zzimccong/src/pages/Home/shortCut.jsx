import main_location from "../../assets/icons/main_location.png"
import main_top from "../../assets/icons/main_top.png"
import main_new from "../../assets/icons/main_new.png"
import main_category from "../../assets/icons/main_category.png"
import main_event from "../../assets/icons/main_event.png"

const shortcutItem = [
  {
    id: 0,
    title: "내 주변",
    url: main_location,
  },
  {
    id: 1,
    title: "T.O.P",
    url: main_top,
  },
  {
    id: 2,
    title: "신상맛집",
    url: main_new,
  },
  {
    id: 3,
    title: "카테고리",
    url: main_category,
  },
  {
    id: 4,
    title: "추첨이벤트",
    url: main_event,
  },
  
];

export default function ShortCut() {
  return (
    <section className="shorcut-list-wrap pb-[20px] px-[20px] mt-[120px]">
      <div className="shortcut-list">
        {shortcutItem.map((item) => {
          return (
            <button className="list-item" key={item.id}
                    onClick={() => alert(`clicked ${item.title}`)}>
              <div className="icon-wrap">
                <img src={item.url} />
              </div>
              <div className="title">{item.title}</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}