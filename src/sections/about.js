import { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { ReactComponent as XIcon } from "../components/icons/x-twitter.svg";
import { ReactComponent as LinkedinIcon } from "../components/icons/linkedin.svg";
import { ReactComponent as ScholarIcon } from "../components/icons/google-scholar.svg";
import "./about.css";

const PHD_START_YEAR = 2025;
const ACADEMIC_YEAR_ROLLOVER_MONTH_INDEX = 8;
const ACADEMIC_YEAR_ROLLOVER_DAY = 1;

function getOrdinalWord(value) {
  const ordinals = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "eighth",
    "ninth",
    "tenth",
  ];

  return ordinals[value - 1] || `${value}th`;
}

function getPhdYearLabel(currentDate = new Date()) {
  const rolloverDate = new Date(
    currentDate.getFullYear(),
    ACADEMIC_YEAR_ROLLOVER_MONTH_INDEX,
    ACADEMIC_YEAR_ROLLOVER_DAY
  );

  const academicYear =
    currentDate >= rolloverDate ? currentDate.getFullYear() : currentDate.getFullYear() - 1;
  const yearNumber = Math.max(1, academicYear - PHD_START_YEAR + 1);

  return `${getOrdinalWord(yearNumber)}-year`;
}

function About({ activeTheme }) {
  const nameAudioRef = useRef(null);
  const photoTransitionTimerRef = useRef(null);
  const [currentPhoto, setCurrentPhoto] = useState(activeTheme.assets.aboutPhoto);
  const [previousPhoto, setPreviousPhoto] = useState(null);
  const [isPhotoTransitioning, setIsPhotoTransitioning] = useState(false);
  const phdYearLabel = getPhdYearLabel();

  useEffect(() => {
    const audio = new Audio("/assets/audio/name.m4a");
    audio.preload = "auto";
    nameAudioRef.current = audio;

    return () => {
      audio.pause();
      nameAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const nextPhoto = activeTheme.assets.aboutPhoto;

    if (nextPhoto === currentPhoto) return;

    const preloadImage = new Image();
    preloadImage.src = nextPhoto;

    const runTransition = () => {
      setPreviousPhoto(currentPhoto);
      setCurrentPhoto(nextPhoto);
      setIsPhotoTransitioning(true);

      if (photoTransitionTimerRef.current) {
        window.clearTimeout(photoTransitionTimerRef.current);
      }

      photoTransitionTimerRef.current = window.setTimeout(() => {
        setPreviousPhoto(null);
        setIsPhotoTransitioning(false);
        photoTransitionTimerRef.current = null;
      }, 320);
    };

    if (preloadImage.complete) {
      runTransition();
      return undefined;
    }

    preloadImage.onload = runTransition;

    return () => {
      preloadImage.onload = null;
    };
  }, [activeTheme.assets.aboutPhoto, currentPhoto]);

  useEffect(
    () => () => {
      if (photoTransitionTimerRef.current) {
        window.clearTimeout(photoTransitionTimerRef.current);
      }
    },
    []
  );

  const handlePronounce = () => {
    const audio = nameAudioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  return (
    <section id="about" className="custom-section" style={{ marginTop: "0.6rem" }}>
      <Row className="gx-3 align-items-start">
        <Col xs={12} md={8} className="about-text-col">
          <h1>Taehyun Yang</h1>
          <div className="name-description mb-3">
            <div className="name-pronunciation">
              Taehyun (태현) is{" "}
              <button type="button" className="pronounce-trigger" onClick={handlePronounce}>
                pronounced{" "}
                <span className="sound-logo" aria-hidden="true">
                  <svg viewBox="0 0 16 16" focusable="false">
                    <path d="M6.2 4.2L3.9 6.1H2.5v3.8h1.4l2.3 1.9V4.2z" fill="currentColor" />
                    <path
                      d="M9.1 6.1c.8.7.8 3.1 0 3.8M10.8 4.6c1.7 1.4 1.7 5.4 0 6.8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>{" "}
              Tay (rhymes with day) + hyun (rhymes with{" "}
              <span className="funyuns-word">
                Funyun
                <img
                  src="/assets/images/misc/funyun.png"
                  alt=""
                  className="funyuns-icon"
                  aria-hidden="true"
                />
              </span>
              ).
            </div>
          </div>

          <p>
            I&apos;m a {phdYearLabel} Ph.D. student in the Department of Computer Science at the{" "}
            <a className="custom-link" href="https://www.umd.edu/" target="_blank" rel="noreferrer">
              University of Maryland College Park
            </a>
            , working with{" "}
            <a className="custom-link" href="https://www.fmyang.com/" target="_blank" rel="noreferrer">
              Fumeng Yang
            </a>{" "}
            at{" "}
            <a className="custom-link" href="https://fig-x.github.io/" target="_blank" rel="noreferrer">
              FIGX Lab
            </a>
            .
          </p>

          <p>
            My research interest lies in modeling human decision-making in open-ended tasks and
            building systems that support exploration and reflection.
          </p>

          <p>
            I received my B.S. in Computer Science &amp; Engineering and Business Administration at{" "}
            <a className="custom-link" href="https://en.snu.ac.kr/" target="_blank" rel="noreferrer">
              Seoul National University
            </a>
            . Previously, I was an undergraduate intern at{" "}
            <a className="custom-link" href="https://hcil.snu.ac.kr/" target="_blank" rel="noreferrer">
              HCIL
            </a>{" "}
            @SNU,{" "}
            <a className="custom-link" href="https://www.kixlab.org/" target="_blank" rel="noreferrer">
              KIXLAB
            </a>{" "}
            @KAIST, and{" "}
            <a
              className="custom-link"
              href="https://tech4good.soe.ucsc.edu/"
              target="_blank"
              rel="noreferrer"
            >
              Tech4Good
            </a>{" "}
            @UCSC, and a SWE intern at Samsung Electronics.
          </p>
        </Col>

        <Col xs={12} md={4} className="about-media-col">
          <div className="about-photo-wrap">
            <div
              className={`about-photo-frame${isPhotoTransitioning ? " is-transitioning" : ""}`}
            >
              {previousPhoto ? (
                <img
                  src={previousPhoto}
                  alt=""
                  aria-hidden="true"
                  className="about-photo about-photo-previous"
                />
              ) : null}
              <img
                src={currentPhoto}
                alt="Taehyun Yang profile"
                className="about-photo about-photo-current"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
            <div className="about-social">
              <a
                className="about-social-button"
                href="https://x.com/yangtaehyun"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                title="X"
              >
                <XIcon />
              </a>
              <a
                className="about-social-button"
                href="https://www.linkedin.com/in/taehyun-yang-055a4824a/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <LinkedinIcon />
              </a>
              <a
                className="about-social-button"
                href="https://scholar.google.com/citations?user=dmG5VkAAAAAJ&hl=en&oi=ao"
                target="_blank"
                rel="noreferrer"
                aria-label="Google Scholar"
                title="Google Scholar"
              >
                <ScholarIcon />
              </a>
            </div>
          </div>
        </Col>
      </Row>
    </section>
  );
}

export default About;
