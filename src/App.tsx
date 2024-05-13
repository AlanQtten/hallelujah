import songs from './common/songs'
import {Button, Form, Input, List, Slider,} from "antd-mobile";
import SongPopup from "./components/SongPopup.tsx";
import {useEffect, useLayoutEffect, useState} from "react";

const correctPwd = 'cyq600103'

function App() {
  return <Slider />
  // const [pass, setPass] = useState(false)
  //
  // const onFinish = (values) => {
  //   setPass(values.password === correctPwd)
  //   localStorage.setItem('password', values.password)
  // }
  //
  // useEffect(() => {
  //   document.title = pass ? '赞美诗400首' : '请输入密码'
  // }, [pass])
  //
  // useLayoutEffect(() => {
  //   const pwd = localStorage.getItem('password')
  //
  //   setPass(pwd === correctPwd)
  // }, [])
  //
  // return pass
  //   ? <SongList />
  //   : <Form onFinish={onFinish}>
  //     <Form.Item name='password' label='密码' rules={[
  //       { required: true }
  //     ]}>
  //       <Input />
  //     </Form.Item>
  //
  //     <Form.Item>
  //       <Button color='primary' type='submit'>提交</Button>
  //     </Form.Item>
  //   </Form>
}

const getSong = (songName, index) => ({
  name: songName,
  songUrl: `./static/mp3/${index + 1}_${songName}.mp3`,
  lrcUrl: `./static/lrc/${index + 1}_${songName}.lrc`,
  index: index,
})

function SongList() {
  const [songPopupVisible, setSongPopupVisible] = useState(false)
  const [song, setSong] = useState<any>()

  const startPlay = (songName, index) => {
    setSongPopupVisible(true)

    setSong(getSong(songName, index))
  }

  const toPre = () => {
    const songName = songs[song.index - 1]
    setSong(getSong(songName, song.index - 1))
  }

  const toNext = () => {
    const songName = songs[song.index + 1]
    setSong(getSong(songName, song.index + 1))
  }

  return <List>
    {
      songs.map((song, index) => {
        return <List.Item
          key={song}
          onClick={() => startPlay(song, index)}
          arrow={false}
        >
          {index + 1}.
          { song }
        </List.Item>
      })
    }

    <SongPopup
      visible={songPopupVisible}
      setVisible={setSongPopupVisible}
      song={song}
      toPre={toPre}
      toNext={toNext}
    />
  </List>
}

export default App
