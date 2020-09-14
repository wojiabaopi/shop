<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table
        :data="rights"
        border
        stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag v-if="scope.row.level == 1" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level == 2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Rights",
    data(){
      return {
        rights: []
      }
    },
    methods: {
      queryRightsList(){
        this.$http.get('/rights/list').then(res => {
          if( res.data.meta.status == 200){
            this.rights = res.data.data
          }
        })
      }
    },
    created() {
      this.queryRightsList()
    }
  }
</script>

<style lang="less" scoped>

  .el-breadcrumb{
    font-size: 12px;
    margin-bottom: 15px;
  }
  .el-card{
    box-shadow: 0 1px 1px rgba(0,0,0,0.2);
  }
  .el-table{
    font-size: 12px;
  }
</style>