import React, { Component } from 'react';
import { getEnv, parseQuery } from '../../common/utils';
import { Button } from 'antd';
import styles from './index.scss';
import { createHashHistory } from 'history'

const history = createHashHistory();

export default class VideoPlayer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      videoName: '',
      collectionName: '从基础到实战 手把手带你掌握新版Webpack4.0',
      rate: 1,
    }
  }
  componentDidMount() {
    const collectionName = parseQuery()['name'];
    this.setState({
      collectionName,
    })
    fetch(`${getEnv()}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `collectionName=${collectionName}`
    },).then(res => res.json()).then(res => {
      const data = res.data;
      const videoName = typeof(data[0]) === 'string' ? data[0] : data[0].list[0];
      const src = typeof(data[0]) === 'string' ? data[0] : `${data[0].name}/${data[0].list[0]}`;
      this.setState({
        data,
        videoName,
        src,
      });
    })
  }

  renderList() {
    const { data } = this.state;

    return (
      <ul className={styles['nav-list']}>{data && data.map((item, fisrtIndex) => {
        if(typeof(item) === 'string') {
          return (
            <li
              className={styles['list-item']}
              onClick={() => {
                this.setState({
                  src: item,
                  videoName: item,
                  fisrtIndex,
                })
              }}
            ><i className={`iconfont ${styles['player-icon']}`}>&#xe6fa;</i>{item}</li>
          )
        } else {
          return (
            <li>
              <div className={styles['chapter-title']}>{item.name}</div>
              <ul>
                {item.list.map((video, secondIndex) => {
                  return (
                    <li
                      className={styles['list-item']}
                      onClick={() => {
                        this.setState({
                          videoName: video,
                          src: `${item.name}/${video}`,
                          secondIndex,
                          fisrtIndex,
                        })
                      }}
                    ><i className={`iconfont ${styles['player-icon']}`}>&#xe6fa;</i>{video}</li>
                  )
                })}
              </ul>
            </li>
          )
        }
        
      })}
    </ul>
    )
  }

  setRate(rate) {
    console.log(rate);
    const video = document.getElementById('video');
    video && (video.playbackRate = rate);
  }

  

  render() {
    const { collectionName, rate, src, videoName } = this.state;

    this.setRate(rate);

    return (
      <div className={styles['video-player']}>
        <header>
          <div
            className={styles['return-btn']}
            onClick={() => {
              // 路由跳转
              history.push('/');
            }}
          >
            <i className={`iconfont ${styles['return-icon']}`}>&#xe677;</i>
            <span className={styles['homepage-text']}>首页</span>
          </div>
          <div className={styles['collection-name']}>
            <span>{collectionName}</span>
          </div>
        </header>
        <div className={styles['container']}>
          <div className={styles['sidebar-container']}>
            <div className={styles['is-playing']}>
              <div>正在播放：</div>
              <div>{videoName}</div>
            </div>
            {this.renderList()}
          </div>
          <div className={styles['content-container']}>
            <video id="video" className={styles['abc']} src={`./videos/${collectionName}/${src}`} controls width="900px" />
            <div className={styles['rate-control']}>
              <div>{rate%1 === 0 ? rate + '.0X' : rate + 'X'}</div>
              <Button onClick={() => {
                
                this.setState({
                  rate: (rate * 10 - 2)/10 < 0 ? 0 : (rate * 10 - 2)/10
                })
              }}>减速</Button>
              <Button onClick={() => {
                this.setState({
                  rate: 1
                });
              }}>原速</Button>
              <Button onClick={() => {
                this.setState({
                  rate: (rate * 10 + 2)/10 > 5 ? 5 : (rate * 10 + 2)/10
                })
              }}>加速</Button>
              <a download href={`./videos/${collectionName}/${src}`} style={{color: '#fff'}}>
                下载
              </a>
            </div>
          </div>
        </div>
      </div>
      
    )
  }
}