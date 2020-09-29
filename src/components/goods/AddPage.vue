<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        style="margin-bottom: 15px"
        :closable="false"
        title="添加商品信息"
        type="info"
        center
        show-icon>
      </el-alert>

      <el-steps align-center :space="200" :active="activeIndex - 0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form label-position="top" :model="addForm" :rules="addRules" ref="addFormref" label-width="100px">
        <el-tabs  @tab-click="tabClick" :before-leave="beforeLeave" v-model="activeIndex" :tab-position="'left'" style="margin-top: 15px">
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.value"
                :options="cateList"
                :props="prpos"
                @change="handleChange"></el-cascader>
            </el-form-item>
            <el-form-item label="商品介绍" prop="goods_introduce">
              <el-input type="text" v-model="addForm.goods_introduce" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <el-form-item :label="item.attr_name" v-for="item in manyData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border v-for="(item2,index) in item.attr_vals" :key="index" :label="item2"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane name="2" label="商品属性">
            <el-form-item v-for="item in onlyData" :label="item.attr_name" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane name="3" label="商品图片">
            <el-upload
              :on-remove="remove"
              :headers="head"
              :on-success="success"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <quill-editor  v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="add" class="btn1">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog
      title="图片预览"
      :visible.sync="prevdialogVisible"
      width="50%%"
    >
      <img :src="imgUrl" alt="" style="width: 100%">
    </el-dialog>
  </div>
</template>

<script>
  import _ from 'lodash'
  export default {
    name: "AddPage",
    data() {
      return {
        prevdialogVisible: false,
        imgUrl: '',
        head: {
          Authorization: window.sessionStorage.getItem('token')
        },
        onlyData: [],
        manyData: [],
        prpos: {
          expandTrigger: 'hover',
          label: 'cat_name',
          value: 'cat_id',
          children: 'children'
        },
        cateList: [],
        activeIndex: '0',
        addForm: {
          goods_name: '',
          goods_price: 0,
          goods_number: 0,
          goods_weight: 0,
          goods_introduce: '',
          value: [],
          pics: [],
          attrs: []
        },
        addRules: {
          goods_name: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          goods_price: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          goods_number: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          goods_weight: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          goods_introduce: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          goods_cat: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      add(){

        this.manyData.forEach( item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.value.join(',')

        this.$http.post('/goods',form).then( res => {
          if(res.data.meta.status == 201){
            this.$msg({
              type: 'success',
              message: '创建成功',
              offset: 200
            })
            this.$router.push('/goods')
          }
        })
      },
      remove(file){
        const filePath = file.response.data.tmp_path
        const i = this.addForm.pics.findIndex( x => x.pic == filePath)
        this.addForm.pics.splice(i,1)
        console.log(this.addForm);
      },
      success(response){
        const picInfo = {
          pic: response.data.tmp_path
        }
        this.addForm.pics.push(picInfo)
      },
      handlePreview(file){
        this.imgUrl = file.response.data.url
        this.prevdialogVisible = true
      },
      tabClick(){
        if(this.activeIndex == '1'){
          this.$http.get(`/categories/${this.cateId}/attributes`,{params: {
            sel: 'many'
            }}).then( res => {
            res.data.data.forEach(item => {
             item.attr_vals = item.attr_vals.split(' ')
            })
            this.manyData = res.data.data
          })
        } else if(this.activeIndex == '2'){
          this.$http.get(`/categories/${this.cateId}/attributes`,{params: {
            sel: 'only'
            }}).then( res => {
            this.onlyData = res.data.data
          })
        }
      },
      beforeLeave(active,oldActive){

        if(oldActive == '0' && this.addForm.value.length != 3){
          this.$msg({
            type: 'warning',
            message: '请先选择商品分类',
            offset: 200
          })
          return false

        }

      },
      handleChange(){
        if(this.addForm.value.length != 3){
          this.addForm.value = []
        }
      },
      getCateList() {
        this.$http.get(`/categories`).then(res => {
          if (res.data.meta.status == 200) {
            this.cateList = res.data.data
          }
        })
      }
    },
    created() {
      this.getCateList()
    },
    computed: {
      cateId(){
        if(this.addForm.value.length == 3){
          return this.addForm.value[2]
        }
        return null
      }
    }
  }
</script>

<style lang="less" scoped>

  .el-card {
    margin: 15px 0;
  }
  .el-checkbox {
    margin: 0 8px 0 0 !important;
  }
  .btn1 {
    margin-top: 15px;
  }

</style>