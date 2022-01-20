import './App.scss';
import PrivateRoute from "./components/PrivateRoute";
import Items from "./routes/Items";
import SignIn from "./routes/SignIn";
import { Routes, Route } from "react-router-dom";
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Layout, Menu, Breadcrumb } from 'antd';
import { onAuthStateChanged } from 'firebase/auth';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import allActions from './actions';
import { auth } from '.';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;


function App() {

  const currentUser = useSelector(state => state.currentUser)

  const dispatch = useDispatch();

  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(allActions.userActions.setUser(user));
      } else {
        dispatch(allActions.userActions.setUser(undefined));
      }
    });
  }, [auth, dispatch]);
console.log("user id", currentUser, auth?.currentUser?.uid)

return (

  <Routes>
    <Route path="/items"
      element={
        <PrivateRoute>
          <Layout style={{ height: '100vh' }}>
            <Header className="header">
              <div className="logo" />
              <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                <Menu.Item key="1">Artículos</Menu.Item>
              </Menu>
            </Header>
            <Layout>
              <Sider width={200} className="site-layout-background">
                <Menu
                  mode="inline"
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  style={{ height: '100%', borderRight: 0 }}
                >
                  <SubMenu key="sub1" icon={<UserOutlined />} title="Listas">
                    <Menu.Item key="1">Actual</Menu.Item>
                  </SubMenu>
                </Menu>
              </Sider>
              <Layout style={{ padding: '0 24px 24px' }}>
                <Content
                  className="site-layout-background"
                  style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                  }}
                >
                  <Items />
                </Content>
              </Layout>
            </Layout>
          </Layout>
        </PrivateRoute>
      } />
    < Route path="/" element={
      < SignIn />
    }>
    </Route>
  </Routes >

);
}

export default App;
