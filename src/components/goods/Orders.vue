<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="goods" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <el-tag v-if="this.goods.pay_status == '1'" type="success">已付款</el-tag>
          <el-tag v-else type="danger">未付款</el-tag>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">

        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot="scope">
            <template>{{scope.row.create_time | dateFormat}}</template>
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button size="mini" @click="query" type="warning" icon="el-icon-location"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 7, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <el-dialog
      title="物流进度"
      :visible.sync="pdialogVisible"
      width="50%">
      <el-timeline >
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.time">
          {{activity.content}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Orders",
    data() {
      return {
        activities: [],
        pdialogVisible: false,
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10,
        },
        total: 0,
        goods: []
      }
    },
    methods: {
      query(){
        this.$http.get('/kuaidi/1106975712662').then( res => {
          this.activities = res.data.data
        })
        this.pdialogVisible = true
      },
      handleCurrentChange(nwePage){
        this.queryInfo.pagenum = nwePage
        this.getOrderList()
      },
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getOrderList()
      },
      getOrderList(){
        this.$http.get('/orders',{params: this.queryInfo}).then( res => {
          if( res.data.meta.status == 200){
            this.total = res.data.data.total
            this.goods = res.data.data.goods
          }
        })
      }
    },
    created() {
      this.getOrderList()
    }
  }
</script>

<style lang="less" scoped>

  .el-breadcrumb {
    margin-bottom: 15px;
  }
  .el-table {
    margin-top: 15px;
  }
</style>