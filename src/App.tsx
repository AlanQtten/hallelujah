import songs from './common/songs'
import {Button, Form, Input, List,} from "antd-mobile";
import SongPopup from "./components/SongPopup.tsx";
import {useEffect, useLayoutEffect, useState} from "react";

const correctPwd = 'cyq600103'

function App() {
  const [pass, setPass] = useState(false)

  const onFinish = (values) => {
    setPass(values.password === correctPwd)
    localStorage.setItem('password', values.password)
  }

  useEffect(() => {
    document.title = pass ? '赞美诗400首' : '请输入密码'
  }, [pass])

  useLayoutEffect(() => {
    const pwd = localStorage.getItem('password')

    setPass(pwd === correctPwd)
  }, [])

  return pass
    ? <SongList />
    : <Form onFinish={onFinish}>
      <Form.Item name='password' label='密码' rules={[
        { required: true }
      ]}>
        <Input />
      </Form.Item>

      <Form.Item>
        <Button color='primary' type='submit'>提交</Button>
      </Form.Item>
    </Form>
}

function SongList() {
  const [songPopupVisible, setSongPopupVisible] = useState(false)
  const [song, setSong] = useState<any>()

  const startPlay = (song, index) => {
    setSongPopupVisible(true)

    setSong({
      name: song,
      songUrl: `./static/mp3/${index + 1}_${song}.mp3`,
      lrcUrl: `./static/lrc/${index + 1}_${song}.lrc`,
      index: index,
    })
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
    />
  </List>
}

export default App
