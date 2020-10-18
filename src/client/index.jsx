import { useState, useEffect, useRef } from 'react'
import { Button, Spin, Modal, Input } from 'antd'
import SyntaxHighlighter from 'react-syntax-highlighter'

const { Search } = Input

export default function Index () {
  const registered = useRef(false)
  const [loading, setLoading] = useState(true)
  function postMessage (data) {
    document.querySelector('#rc-widget-adapter-frame').contentWindow.postMessage(data, '*')
  }
  function openMeeting () {
    postMessage({
      type: 'rc-adapter-navigate-to',
      path: '/meeting/schedule'
    })
  }
  function dial (v) {
    postMessage({
      type: 'rc-adapter-new-call',
      phoneNumber: v,
      toCall: true
    })
  }
  function showEvent (title, data) {
    Modal.info({
      title: 'Incoming event: ' + title,
      width: '90%',
      height: '90%',
      content: (
        <SyntaxHighlighter language='javascript'>
          {JSON.stringify(data, null, 2)}
        </SyntaxHighlighter>
      )
    })
  }
  function onEvent (e) {
    const { data = {} } = e
    console.log('data', data)
    const { type, path, requestId } = data
    if (type !== 'rc-post-message-request') {
      return
    }
    if (path === '/meeting/invite') {
      showEvent('Sync sheduled Meeting to third party', data)
    } else if (path === '/meetingUpcomingList') {
      showEvent('Request third party incoming meeting data', data)
      const date = new Date().toISOString()
      postMessage({
        type: 'rc-post-message-response',
        responseId: requestId,
        response: {
          data: [{
            id: '123456',
            title: 'Test Meeting in TestService',
            editEventUrl: window.location.href,
            startTime: date,
            endTime: date,
            meetingIds: ['433214948']
          }]
        }
      })
    } else if (path === '/meetingLogger') {
      showEvent('Sync meeting log to third party', data)
      postMessage({
        type: 'rc-post-message-response',
        responseId: requestId,
        response: { data: 'ok' }
      })
    } else if (path === '/conference/invite') {
      showEvent('Click invite button', data)
      postMessage({
        type: 'rc-post-message-response',
        responseId: requestId,
        response: { data: 'ok' }
      })
    }
  }
  function registerService () {
    postMessage({
      type: 'rc-adapter-register-third-party-service',
      service: {
        name: 'TestService',
        meetingInvitePath: '/meeting/invite',
        meetingInviteTitle: 'Invite with TestService',
        meetingUpcomingPath: '/meetingUpcomingList',
        meetingLoggerPath: '/meetingLogger',
        meetingLoggerTitle: 'Log to TestService'
      }
    })
    setLoading(false)
    window.addEventListener('message', onEvent)
  }
  function init (e) {
    console.log('event', e.data)
    const { data } = e
    if (
      data &&
      data.type === 'rc-adapter-pushAdapterState' &&
      registered.current === false
    ) {
      console.log('init')
      registered.current = true
      registerService()
      window.removeEventListener('message', init)
    }
  }
  function initEvent () {
    window.addEventListener('message', init)
  }
  useEffect(() => {
    initEvent()
  }, [])
  return (
    <div className='wrap'>
      <h1>ringcentral-embeddable-rcv-demo</h1>
      <Spin spinning={loading}>
        <p>
          <Button
            onClick={openMeeting}
            type='primary'
          >
            Open meeting panel
          </Button>
        </p>
        <p>
          <Search
            enterButton='Dial'
            placeholder='Enter phone number'
            onSearch={dial}
          />
        </p>
      </Spin>
      <div className='pd2y'>
        <ul>
          <li>
            <a target='_blank' href='https://github.com/ringcentral/ringcentral-embeddable/blob/master/docs/third-party-service-in-widget.md'>ringcentral-embeddable/third-party-service-in-widget.md</a>
          </li>
          <li>
            <a target='_blank' href='https://github.com/ringcentral/ringcentral-embeddable-rcv-demo/blob/main/src/client/index.jsx'>Code of current page</a>
          </li>
        </ul>
      </div>
    </div>
  )
}
