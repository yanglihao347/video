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
      autoPlay: false,
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
      const firstIndex = 0;
      const secondIndex = typeof(data[0]) === 'string' ? '' : 0;
      const src = typeof(data[0]) === 'string' ? data[0] : `${data[0].name}/${data[0].list[0]}`;
      this.setState({
        data,
        firstIndex,
        secondIndex,
        videoName,
        src,
      });
    })
    const video = document.getElementById('video');
    video.addEventListener('loadedmetadata', () => {
      console.log('======loadedmetadata');
    })
    video.addEventListener('loadeddata', () => {
      console.log('======loadeddata');
    })
    video.addEventListener('canplay', () => {
      console.log('======canplay');
    })
    video.addEventListener('durationchange', () => {
      if(this.state.autoPlay) {
        this.setState({
          autoPlay: false,
        });
        video.play();
      }
      
    })
    video.addEventListener('ended', () => {
      let { data, firstIndex, secondIndex, src, videoName } = this.state;

      if(secondIndex !== '' && (data[firstIndex].list.length !== secondIndex + 1)) {
        secondIndex += 1;
        videoName = data[firstIndex].list[secondIndex];
        src = `${data[firstIndex].name}/${videoName}`;
      } else {
        if (data.length !== firstIndex + 1) {
          if(typeof(data[firstIndex + 1]) === 'string') {
            firstIndex += 1;
            secondIndex = '';
            videoName = data[firstIndex];
            src = videoName;
          } else {
            firstIndex += 1;
            secondIndex = 0;
            videoName = data[firstIndex].list[0];
            src = `${data[firstIndex].name}/${videoName}`;
          }
        } else {
          //do nothing;
        }
      }
      this.setState({
        firstIndex,
        secondIndex,
        src,
        videoName,
        autoPlay: true,
      })
    })
  }

  renderList() {
    const { data } = this.state;

    return (
      <ul className={styles['nav-list']}>{data && data.map((item, firstIndex) => {
        if(typeof(item) === 'string') {
          return (
            <li
              className={styles['list-item']}
              onClick={() => {
                this.setState({
                  src: item,
                  videoName: item,
                  firstIndex,
                  secondIndex: '',
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
                          firstIndex,
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