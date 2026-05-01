import { useEffect, useRef, useState } from "react";

function Home() {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // ۱. تعریف نگهبان (Observer)
  const observer = new IntersectionObserver(
    ([entry]) => {
      // اگر المنت وارد صفحه شده باشد entry.isIntersecting باthreshold: 0.5 || entry.intersectionRatio > 0
      if (entry.isIntersecting) {
        setIsVisible(true);
        console.log("المنت دیده شد!");
        // اگر فقط یکبار می‌خواهی اجرا شود، نگهبانی را متوقف کن:
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.5 }, // یعنی ۵۰٪ المنت باید دیده شود تا اوکی بدهد
  );
  useEffect(() => {
    // ۲. شروع نگهبانی روی المنت ما
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    // ۳. تمیزکاری (وقتی کامپوننت از بین می‌رود)
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ height: "200vh" }}>
      {" "}
      {/* یک فضای خالی زیاد برای اسکرول */}
      <div
        ref={elementRef}
        style={{
          marginTop: "150vh",
          background: isVisible ? "green" : "red",
          transition: "2s",
          padding: "20px",
          color: "white",
          textAlign: "center",
        }}
      >
        {isVisible ? "سلام! من رو دیدی 😊" : "هنوز به من نرسیدی..."}
      </div>
    </div>
  );
}

export default Home;
