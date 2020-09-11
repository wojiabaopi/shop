<template>
  <div class="home">
    <el-container class="cont">

      <el-header>
        <div>
          <img src="../assets/img/heima.png" alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="quit">退出</el-button>
      </el-header>
      <el-container>
        <el-aside  :width="isCollapse ? '64px' : '200px' ">
          <div class="div1" @click="change">|||</div>
          <el-menu
            active-text-color="#409EFF"
            background-color="#333744"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            router
            :default-active="activePath"
            text-color="#fff">
            <el-submenu v-for="item in menuList.data"  :index="item.id + ''">
              <template slot="title">
                <i :class="iconArr[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item @click="savePath('/'+ child.path)" v-for="child in item.children" :index="'/'+ child.path">
                <i class="el-icon-menu"></i>
                <span>{{child.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: "Home",
    components: {
    },
    data(){
      return{
        menuList: [],
        iconArr: {
          '125': 'el-icon-user-solid',
          '103': 'el-icon-reading',
          '101': 'el-icon-s-goods',
          '102': 'el-icon-s-order',
          '145': 'el-icon-s-marketing'
        },
        isCollapse: false,
        activePath: ''
      }
    },
    methods: {
      quit() {
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      selectMenu(){
        this.$http.get('/menus').then( res =>{
          this.menuList = res.data
        })
      },
      change(){
        this.isCollapse = ! this.isCollapse
      },
      savePath(path){
        window.sessionStorage.setItem('activePath',path)
        this.activePath = path
      }
    },
    created() {
      this.selectMenu()
      this.activePath = window.sessionStorage.getItem('activePath')
    }
  }
</script>

<style lang="less" scoped>
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ffffff;
    padding-left: 0;

    div {
      display: flex;
      align-items: center;

      span {
        font-size: 18px;
        padding-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333744;
    .el-menu{
      border-right: none;
    }
  }

  .el-main {
    background-color: #EAEDF1;
  }

  .home {
    height: 100%;

    .cont {
      height: 100%;
    }
  }

  .div1{
    background-color: #4A5064;
    color: #ffffff;
    text-align: center;
    font-size: 10px;
    line-height: 24px;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>