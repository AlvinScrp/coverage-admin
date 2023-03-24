<template>
  <div style="margin-top: -20px;">
    <div>
      <el-select v-model="appNameDisplay" placeholder="应用名称" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in appNameDisplayOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input v-model="form.buildNum" placeholder="构建序号" type="Number" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询可用日志
      </el-button>
      <span v-if="showErrorAppName" class="error-text"> 应用名不能为空!</span>
      <span v-if="showErrorBuildNum" class="error-text"> 构建序号为数字,并且>0!</span>
    </div>
    <el-table style="margin-top: 10px;" size="small" max-height="315px" border :data="logs" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column label="日志">
        <template slot-scope="scope">  {{ scope.row.name }} </template>
      </el-table-column>

    </el-table>
    <div v-if="showErrorLog">
      <span class="error-text"> 至少选择一个日志文件</span>
    </div>
    <div class="increment-container">
      <el-checkbox v-model="form.increment">增量报告</el-checkbox>
      <div v-if="form.increment" class="filter-item">
        <span>相对于构建序号为 </span>
        <el-input v-model="form.relativebuildNum" size="small" style="width: 80px;" />
        <span> 的增量</span>
      </div>
    </div>
    <div v-if="showErrorIncrement">
      <span class="error-text"> 增量报告，需要填写相对构建序号，且>0</span>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('dismiss')">取 消</el-button>
      <el-button type="primary" @click="handleCreate()">创建</el-button>
    </div>
  </div>
</template>

<script>
import { getLogList, createReport } from '@/api/report'
export default {
  props: {
    appNameDisplayProp: {
      type: String,
      default: ''
    },
    appNameProp: {
      type: String,
      default: ''
    },
    buildNumProp: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        appName: '',
        buildNum: '',
        increment: true,
        relativebuildNum: '8',
        selectLogs: []
      },
      appNameDisplay: '',
      appNameOptions: ['fxj', 'hyk'],
      appNameDisplayOptions: ['蜂享家掌柜-Android', '好衣库-Android'],
      logs: [],
      errors: 0
    }
  },
  computed: {

    showErrorAppName: function() {
      return (this.errors & 1) > 0
    },
    showErrorBuildNum: function() {
      return (this.errors & 2) > 0
    },
    showErrorLog: function() {
      return (this.errors & 4) > 0
    },
    showErrorIncrement: function() {
      return (this.errors & 8) > 0
    }
  },
  watch: {
    appNameDisplay: function(newVal, oldVal) {
      var index = this.appNameDisplayOptions.indexOf(newVal)
      var name = this.appNameOptions[index]
      console.log(name)
      this.form.appName = name
    }
  },

  created() {
    console.log('create')
    this.appNameDisplay = this.appNameDisplayProp
    this.form.appName = this.appNameProp
    this.form.buildNum = this.buildNumProp
    this.fetchLogList(true)
  },
  mounted() {
    console.log('mounted')
  },
  methods: {
    fetchLogList(manual) {
      console.log(`this.form.appName:${this.form.appName}`)
      console.log(`${!this.form.appName}`)
      if (!this.form.appName || !this.form.buildNum || parseInt(this.form.buildNum) <= 0) {
        if (manual) {
          this.$message.error('应用名不允许为空,构建序号必须 > 0')
        }
        return
      }
      var listQuery = { appName: this.form.appName, buildNum: this.form.buildNum }
      getLogList(listQuery).then(response => {
        this.logs = response.entry.list
      })
    },
    handleFilter() {
      this.fetchLogList(true)
    },
    handleSelectionChange(selections) {
      this.form.selectLogs = selections
      console.log(this.form.selectLogs)
    },
    showError(index) {
      console.log(`showError:${index} ${(this.errors & index) > 0}`)
      return (this.errors & index) > 0
    },
    handleCreate() {
      const { appName, buildNum, selectLogs, increment, relativebuildNum } = this.form
      var error = 0
      if (!appName) error |= 1
      var buildNumInt = parseInt(buildNum, 10)
      if (!buildNumInt || buildNumInt <= 0) error |= 2
      if (!selectLogs || selectLogs.length === 0) error |= 4
      var relativebuildNumInt = parseInt(relativebuildNum, 10)
      if (increment && (!relativebuildNumInt || relativebuildNumInt <= 0)) error |= 8

      console.log(buildNum)
      this.errors = error
      console.log(this.errors)
      if (error > 0) {
        this.$notify.error('参数异常')
        return
      }
      var data = { appName, buildNum: buildNumInt, logs: selectLogs, increment }
      if (increment) {
        data.relativebuildNum = relativebuildNumInt
      }
      createReport(data).then(response => {
        console.log(`createReport response:${JSON.stringify(response)}`)
        if (response.status === true) {
          this.$emit('dismiss')
          this.$emit('create-success')
        }
      })
    }

  }
}
</script>
<style lang='scss' scoped>

.filter-item{
    margin-left: 10px;
}
.increment-container{
    display: flex;
    margin-top: 10px;
    height: 50px;
    align-items: center;
}
.dialog-footer{
   display: flex;
   justify-content: right;
}
.error-text{
    color: red;
}

</style>
