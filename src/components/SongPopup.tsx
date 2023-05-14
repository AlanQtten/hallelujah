import { Popup, Slider, Toast } from "antd-mobile";
import { useEffect, useMemo, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import {DownOutline, LeftOutline, PlayOutline, RightOutline} from "antd-mobile-icons";
import cx from 'classnames'
import {CaretRightOutlined, PauseOutlined} from "@ant-design/icons";
import songs from "../common/songs.ts";

const useStyle = createUseStyles({
  wrapper: {
    height: '100vh',
    background: 'rgba(0, 0, 0, .5)',
    padding: '0 8px',
    boxSizing: 'border-box',
  },
  header: {
    height: '5vh',
    display: 'flex',
    alignItems: 'center',
    color: "#fff",
    position: 'relative'
  },
  title: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  },
  container: {
    height: '80vh',
    overflow: 'scroll',
    position: 'relative',
    padding: 'calc((80vh - 50px) / 2) 0',
    boxSizing: 'border-box'
  },
  lyricsLine: {
    height: '50px',
    lineHeight: '50px',
    fontSize: '1rem',
    textAlign: 'center',
    color: 'rgba(0, 0, 0, .3)',
    '&.highlight': {
      color: '#fff'
    }
  },
  footer: {
    width: '100%',
    height: '15vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  controlBarWrapper: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    color: '#fff',
    marginBottom: 16,
  },
  slider: {
    flex: 1,
  },
  controlBtnWrapper: {
    display: 'flex',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '1.5rem',
    '&>button': {
      border: '2px solid #fff',
      borderRadius: '50%',
      padding: 8,
      width: '2.5rem',
      height: '2.5rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '&:not(:last-child)': {
        marginRight: '5vw'
      }
    }
  }
})

const fillZero = number => {
  return number < 10 ? `0${number}` : number
}

const transformTimestamp = (ts) => {
  const [min, secondWithMillisecond] = ts.split(':')

  return (+min) * 60 + +secondWithMillisecond
}

export default function SongPopup(props) {
  const {
    visible,
    setVisible,
    song = {},
    toPre = () => {},
    toNext = () => {}
  } = props
  const classes = useStyle()
  const [songUrl, setSongUrl] = useState('')
  const [lastSecond, setLastSecond] = useState(0)

  const [currentTime, setCurrentTime] = useState(0)
  const [exactCurrentTime, setExactCurrentTime] = useState(0)
  const [dragCurrentTime, setCurrentDragTime] = useState(0)
  const [playing, setPlaying] = useState(false)

  const [lyrics, setLyrics] = useState([])

  const audio = useRef<HTMLMediaElement>()
  const container = useRef<HTMLDivElement>()
  const [disabledAutoScroll, setDisabledAutoScroll] = useState(false)
  const [disabledAutoScrollTimer, setDisabledAutoScrollTimer] = useState(null)

  const currentPre = useMemo(() => {
    const targetTime = dragCurrentTime || currentTime

    const minutes = Math.floor(targetTime / 60)
    const seconds = targetTime - minutes * 60

    return `${fillZero(minutes)}:${fillZero(seconds)}`
  }, [currentTime, dragCurrentTime])

  const totalTime = useMemo(() => {
    const minutes = Math.floor(lastSecond / 60)
    const seconds = Math.floor(lastSecond - minutes * 60)

    return `${fillZero(minutes)}:${fillZero(seconds)}`
  }, [lastSecond])

  useEffect(() => {
    if(visible && song && song.songUrl && song.lrcUrl) {
      setSongUrl(song.songUrl)
      loadLyrics(song.lrcUrl)
    }
  }, [visible, song])

  const loadLyrics = (lyricsUrl) => {
    fetch(lyricsUrl)
      .then(resp => resp.text())
      .then(resp => {
        setLyrics(resp
          .replace(/\r/g, '')
          .split('\n')
          .filter(Boolean)
          .reduce((pre, current) => {
            if(current.indexOf(']') === -1) {
              return pre
            }
            const [timestamp, content] = current.split(']')

            if(!content) {
              return pre
            }

            pre.push({
              timestamp: transformTimestamp(timestamp.slice(1)),
              content
            })

            return pre
          }, [])
        )
      })
      .catch(e => {
        Toast.show({
          icon: 'fail',
          content: e.message
        })
      })
  }

  const showLyrics = useMemo(() => {
    const _lyrics = lyrics.map((line) => ({...line, highlight: false}))
    const _highlightRow = _lyrics.findLast(line => line.timestamp <= exactCurrentTime)

    _highlightRow && (_highlightRow.highlight = true)

    return _lyrics
  }, [lyrics, exactCurrentTime])

  useEffect(() => {
    if(showLyrics.length === 0) {
      return
    }
    const index = showLyrics.findIndex(line => line.highlight)
    if(index === -1) {
      return
    }

    if(disabledAutoScroll) {
      return
    }
    container.current.scrollTo({
      top: index * 50,
      behavior: 'smooth'
    })
  }, [showLyrics])

  const onLoadMetadata = e => {
    setLastSecond(Math.floor(e.target.duration))
  }

  const onTimeupdate = (e) => {
    setCurrentTime(Math.floor(e.target.currentTime))
    setExactCurrentTime(e.target.currentTime)
  }

  const onPlayEnd = () => {
    setCurrentTime(0)
    pause()
  }

  const onChange = time => {
    if(playing) {
      setCurrentDragTime(time)
    }else {
      setCurrentTime(time)
    }
  }

  const onAfterChange = time => {
    audio.current.currentTime = time
    setCurrentTime(time)
    setCurrentDragTime(0)

    if(playing) {
      pause()
      setTimeout(() => {
        play()
      })
    }
  }

  const pause = () => {
    setPlaying(false)
    audio.current.pause()
  }

  const play = () => {
    setPlaying(true)
    audio.current.play()
  }

  const resetAll = () => {
    setPlaying(false)
    setCurrentTime(0)
    setExactCurrentTime(0)
    setCurrentDragTime(0)
    setLastSecond(0)
    setLyrics([])
    clearDisabledAutoScrollTimer()
    setDisabledAutoScroll(false)
    audio.current.pause()
  }

  const back = () => {
    setVisible(false)
    resetAll()
  }

  const internalToPre = () => {
    if(song.index === 0) {
      Toast.show({
        content: '已经是第一首了'
      })
      return
    }

    resetAll()
    toPre()
  }

  const internalToNext = () => {
    if(song.index === songs.length - 1) {
      Toast.show({
        content: '已经是最后一首了'
      })
      return
    }

    resetAll()
    toNext()
  }

  const togglePlay = () => {
    if(playing) {
      pause()
    }else {
      play()
    }
  }

  const onTouchStart = () => {
    clearDisabledAutoScrollTimer()
    setDisabledAutoScroll(true)
  }

  const onTouchEnd = () => {
    setDisabledAutoScrollTimer(setTimeout(() => {
      setDisabledAutoScroll(false)
    }, 5000))
  }

  const clearDisabledAutoScrollTimer = () => {
    clearTimeout(disabledAutoScrollTimer)
    setDisabledAutoScroll(null)
  }

  return <Popup
    visible={visible}
  >
    <div className={classes.wrapper}>
      <audio
        src={songUrl}
        ref={audio}
        onLoadedMetadata={onLoadMetadata}
        onTimeUpdate={onTimeupdate}
        onEnded={onPlayEnd}
      />

      <div className={classes.header}>
        <button onClick={back}>
          <DownOutline />
        </button>

        <h1 className={classes.title}>{ song.name }</h1>
      </div>

      <div
        className={classes.container}
        ref={container}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {
          showLyrics.map((item, index) => {
            return <div key={index} className={cx([classes.lyricsLine, item.highlight && 'highlight'])}>
              {item.content}
            </div>
          })
        }
      </div>

      <div className={classes.footer}>
        <div className={classes.controlBarWrapper}>
          <span>{currentPre}</span>

          <Slider
            className={classes.slider}
            min={0}
            max={lastSecond}
            value={dragCurrentTime ? dragCurrentTime : currentTime}
            onChange={onChange}
            onAfterChange={onAfterChange}
          />

          <span>{totalTime}</span>
        </div>

        <div className={classes.controlBtnWrapper}>
          <button onClick={internalToPre}>
            <LeftOutline />
          </button>

          <button onClick={togglePlay}>
            {
              playing ? <PauseOutlined /> : <PlayOutline />
            }
          </button>

          <button onClick={internalToNext}>
            <RightOutline />
          </button>
        </div>
      </div>
    </div>
  </Popup>
}
