import { useState } from 'react';
import './App.scss';
import { Avatar, Button, Card, Col, InputNumber, List, Row, message } from 'antd';
import qs from 'qs';

const corsUrl = 'https://api.codetabs.com/v1/proxy/?quest=';

// 封装get方法
export const get = async (props: { url: any; query?: any; cors?: boolean; options?: any; }) => {
	const { url: baseUrl, query = {}, options = {}, cors = false } = props;
	const queryStr = qs.stringify(query);
	const url = `${baseUrl}${queryStr !== '' ? '?' : ''}${queryStr}`;
	return fetch(`${cors ? '' : corsUrl}${url}`, {
		...options,
	}).then(r => r.json());
};

const getFollowing = async (id: number, pn: number, ps = 10) => {
  return get({
    url: 'https://line3-h5-mobile-api.biligame.com/game/center/h5/user/relationship/following_list',
    query: {
      vmid: id, 
      pn,
      ps,
    }
  });
}

const getStat = (id: number) => {
  return get({
    url: 'https://api.bilibili.com/x/relation/stat',
    query: {
      vmid: id,
      jsonp: 'jsonp'
    },
    cors: true,
  })
}

type Attention = {
  attribute: number
  face: string
  mid: string
  uname: string
}

function App() {
  const [id, setId] = useState<number | null>();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Attention[]>([]);
  const [total, setTotal] = useState(0);

  const onPageChange = async (page: number) => {
    if (id) {
      try {
        setPage(page);
        message.open({
          key: 'onPageChange',
          type: 'loading',
          content: '正在查询',
        });
        const data = await getFollowing(id, page);
        setData(data?.data?.list);
        message.open({
          key: 'onPageChange',
          type: 'success',
          content: '查询成功',
          duration: 1,
        });
      } catch (error) {
        message.open({
          key: 'onPageChange',
          type: 'error',
          content: '查询失败，请重试',
          duration: 2,
        });
      }
    }
  }

  const onSearch = async () => {
    if (id) {
      try {
        setLoading(true);
        const [listData, stat] = await Promise.all([
          getFollowing(id, 1),
          getStat(id)
        ]);
        setLoading(false);
        setPage(1);
        setData(listData?.data?.list);
        setTotal(stat?.data?.following);
        message.success('查询成功');
      } catch (error) {
        setLoading(false);
        message.error('查询失败，请重试');
      }
    } else {
      message.error('请输入查询uid');
    }
  }
  return (
    <div className='main'>
			<div className='main-body'>
				<Row gutter={8} justify='center'>
					<Col xs={20} sm={16} md={12} lg={12} xl={12} xxl={8}>
						<Card
							title={'kknd'}
							className='main-card'
						>
              <div className='main-form'>
                <InputNumber
                  style={{
                    width: 'calc(100% - 64px)'
                  }}
                  value={id}
                  onChange={(e) => setId(e)}
                  controls={false}
                ></InputNumber>
                <Button
                  style={{
                    marginLeft: '8px',
                  }}
                  loading={loading}
                  onClick={onSearch}
                >查找</Button>
              </div>
              <div className='main-list'>
                <List
                  pagination={{
                    current: page,
                    size: 'small',
                    pageSize: 10,
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                    total: total,
                    onChange: (page) => onPageChange(page),
                  }}
                  bordered
                  dataSource={data}
                  renderItem={(item) => (
                    <List.Item>
                      <div>
                        <Avatar src={item.face} style={{ marginRight: '8px' }}></Avatar>
                        <a href={`https://space.bilibili.com/${item.mid}`} target='_blank'>
                          {item.uname}                    
                        </a>
                      </div>
                    </List.Item>
                  )}
                ></List>
              </div>
						</Card>
					</Col>
				</Row>
			</div>
		</div>
  )
}

export default App;
