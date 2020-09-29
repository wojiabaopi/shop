<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-input clearable @clear="getGoodsList" class="input1" placeholder="请输入内容" v-model="queryInfo.query">
          <el-button slot="append" @click="getGoodsList" icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click="addPage" type="primary">添加商品</el-button>
      </el-row>
      <el-table
        stripe
        border
        :data="goodsList"
        style="width: 100%">
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column label="商品名称" prop="goods_name">
        </el-table-column>
        <el-table-column width="110px" label="商品价格(元)" prop="goods_price">
        </el-table-column>
        <el-table-column width="80px" label="商品重量" prop="goods_weight">
        </el-table-column>
        <el-table-column width="170px" label="创建时间" prop="upd_time">
          <template v-slot="scope">{{scope.row.upd_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column width="120px" label="操作">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button size="mini" @click="deleteGoods(scope.row)" type="danger" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3,5, 7, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Goods",
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        goodsList: [],
        total: 0
      }
    },
    methods: {
      addPage(){
        this.$router.push('/goods/addPage')
      },
      deleteGoods(row){
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`/goods/${row.goods_id}`).then( res => {
            if(res.data.meta.status == 200){
              this.$msg({
                type: 'success',
                message: res.data.meta.msg,
                offset: 200
              })
              this.getGoodsList()
            }
          })
        }).catch(() => {
          this.$msg({
            type: 'info',
            message: '已取消删除',
            offset: 200
          });
        });
      },
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getGoodsList()
      },
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getGoodsList()
      },
      getGoodsList() {
        this.$http.get(`/goods`, {
          params: this.queryInfo
        }).then(res => {
          if (res.data.meta.status == 200) {
            this.goodsList = res.data.data.goods
            this.total = res.data.data.total
          }
        })
      }
    },
    created() {
      this.getGoodsList()
    }
  }
</script>

<style lang="less" scoped>
  .el-card {
    margin-top: 15px;

  }

  .input1 {
    width: 400px;
    margin-right: 15px;
    margin-bottom: 15px;
  }
</style>