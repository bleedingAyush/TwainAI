import styles from "./styles/Hero.module.css";
import GoogleChrome from "../../../assets/addToChrome.svg";
import ChromeExtension from "../../../assets/chrome-extension.png";
import usage from "../../../assets/usage.png";

const Hero = () => {
  return (
    <>
      <div className={styles.desktop2}>
        <div className={styles.frameParent}>
          <div className={styles.getAccessToChatgptWithAKParent}>
            <h1 className={styles.getAccessTo}>
              Get access to ChatGpt with a keyboard shortcut
            </h1>
            <h2 className={styles.workWithAn}>
              Work with an AI writing partner that helps you find the words you
              need⁠—⁠to write that tricky email, to get your point across, to
              keep your work moving.
            </h2>
            <div className={styles.headerElements}>
              <a
                className={styles.loginsignUpWrapper}
                href="https://twainai.netlify.app"
                target="_blank"
              >
                <div className={styles.loginsignUp}>LOGIN/SIGN UP</div>
              </a>
              <a
                className={styles.addToChrome}
                href="https://www.youtube.com"
                target="_blank"
              >
                <div className={styles.addToChrome1}>Add to Chrome</div>
                <img
                  className={styles.googleChromeIconFebruary2}
                  alt=""
                  src={GoogleChrome}
                />
              </a>
            </div>
          </div>
          <img className={styles.frameChild} alt="" src={ChromeExtension} />
        </div>
        <div className={styles.frameParent}>
          <div className={styles.featureWrapper}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className={styles.featureText}>Built in</span>
              <span className={styles.featureText}>Powerful Analytics</span>
            </div>
            <span className={styles.workWithAn}>
              Keep an eye on how much words you have left.
            </span>
          </div>
          <img src={usage} alt="" className={styles.frameChild} />
        </div>
      </div>
      <div
        style={{ width: "100%", background: "#393939", paddingLeft: "2rem" }}
      >
        {/* copywright */}
        <div style={{ padding: "10px 0", color: "white" }}>
          <span>© 2024 TwainAI, Inc. All rights reserved.</span>
        </div>
      </div>
    </>
  );
};

export default Hero;
