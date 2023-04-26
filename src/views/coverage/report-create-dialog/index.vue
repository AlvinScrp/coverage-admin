<template>
  <div id="dialog-body" style="margin-top: -20px;">
    <div>
      应用名称：
      <el-select v-model="appNameDisplay" size="small" placeholder="应用名称" style="width: 200px" class="filter-item">
        <el-option v-for="item in appNameDisplayOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <span style="color: red;font-size: 20px;"> * </span>
    </div>
    <div style="margin-top: 10px;">
      报告是基于此次构建
      <el-input v-model="buildNum" placeholder="构建序号" size="small" type="Number" style="width: 130px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询可用日志
      </el-button> -->
      <span style="color: red;font-size: 20px;"> * </span>
      <div v-if="showErrorBuildNum">
        <span class="error-text"> 至少选择一个包含日志的构建序号</span>
      </div>
      <!-- </div>
    <div style="margin-top: 10px;"> -->
      <span>的代码，相较构建序号</span>
      <el-input v-model="relativebuildNum" size="small" type="Number" placeholder="相对构建序号" style="width: 130px;" class="filter-item" />
      <span> 所有变更代码的增量报告 （不填，就生成全量报告）</span>
    </div>
    <!-- :selectable="row.enable" -->

    <div>
      <!-- <p>日志目录可选条件：<span style="color: red;">&lt;= 构建序号 &&  &gt;相对构建序号</span> <span v-if="isIOS" style="margin-left: 10px;">  ( iOS应用不需要勾选日志目录 ) </span></p> -->
      <p>选择jenkins构建安装包的运行日志：</p>
      <el-table
        ref="logBuildTable"
        style="margin-top: 10px;"
        max-height="515px"
        border
        :data="builds"
        :row-style="tableRowStyle"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          :selectable="checkSelectable"
        />
        <!-- :class="logTextStyle(scope.row)" -->
        <el-table-column width="80" label="构建序号" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.buildNum }}
            </span> </template>
        </el-table-column>
        <el-table-column width="120" label="包含运行日志" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.hasLogDir?"是":"否" }}
            </span> </template>
        </el-table-column>
        <el-table-column width="150" label="分支" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.jenkinsInfo? scope.row.jenkinsInfo.branch : "" }}
            </span> </template>
        </el-table-column>
        <el-table-column width="80" label="构建环境" align="center">
          <template slot-scope="scope">
            {{ scope.row.jenkinsInfo? scope.row.jenkinsInfo.environment : "" }}
          </template>
        </el-table-column>
        <el-table-column width="100" label="发布/审核包" align="center">
          <template slot-scope="scope">
            {{ scope.row.jenkinsInfo? (scope.row.jenkinsInfo.isDeploy?"是":"否"):"" }}
          </template>
        </el-table-column>
        <el-table-column width="90" label="构建人" align="center">
          <template slot-scope="scope">
            {{ scope.row.jenkinsInfo? scope.row.jenkinsInfo.userName :"" }}
          </template>
        </el-table-column>
        <el-table-column width="190" label="构建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.jenkinsInfo? scope.row.jenkinsInfo.timeFormat :"" }}
          </template>
        </el-table-column>

        <el-table-column label="构建详情 ">
          <template slot-scope="scope">
            <el-button v-if="scope.row.jenkinsInfo" type="text" size="mini" @click="handlePreviewBuildDetail(scope.row)">
              查看
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <div v-if="showErrorLog">
        <span class="error-text"> 至少选择一个包含日志的目录</span>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('dismiss')">取 消</el-button>
      <el-button type="primary" @click="handleCreate()">创建</el-button>
    </div>
  </div>
</template>

<script>
import { getLogList, getLogBuildList, createReport } from '@/api/coverage.js'
export default {
  props: {
    appNameDisplayProp: {
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
      buildNum: '',
      relativebuildNum: '',
      selectLogs: [],
      appNameDisplay: '蜂享家掌柜-Android',
      appNameOptions: ['FXJ', 'FXJ', 'HYK'],
      osTypes: ['Android', 'iOS', 'Android'],
      appNameDisplayOptions: ['蜂享家掌柜-Android', '蜂享家掌柜-iOS', '好衣库-Android'],
      logs: [],
      builds: [],
      errors: 0
    }
  },
  computed: {
    showErrorBuildNum: function() {
      return (this.errors & 2) > 0
    },
    showErrorLog: function() {
      return (this.errors & 4) > 0
    },
    isIOS: function() {
      var appIndex = this.appNameDisplayOptions.indexOf(this.appNameDisplay)
      return this.osTypes[appIndex] === 'iOS'
    }
  },
  watch: {
    buildNum(val) {
      this.resetLogBuildSelection()
    },
    relativebuildNum(val) {
      this.resetLogBuildSelection()
    },
    appNameDisplay: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.buildNum = ''
        this.fetchLogList()
      }
    }
  },

  created() {
    console.log('create')
    this.appNameDisplay = this.appNameDisplayProp
    this.buildNum = this.buildNumProp
    this.fetchLogList(true)
  },
  mounted() {
    console.log('mounted')
  },
  methods: {
    fetchLogList(manual) {
    //   if (!this.buildNum || parseInt(this.buildNum) <= 0) {
    //     if (manual) {
    //       this.$message.error('构建序号必须 > 0')
    //     }
    //     return
    //   }
      var appIndex = this.appNameDisplayOptions.indexOf(this.appNameDisplay)
      var listQuery = {
        appName: this.appNameOptions[appIndex],
        osType: this.osTypes[appIndex],
        buildNum: this.buildNum }

      getLogBuildList(listQuery).then(response => {
        this.builds = response.entry.list
        console.log('this.builds[0]')
        console.log(this.builds[0])
        this.$nextTick(() => {
          this.resetLogBuildSelection()
        })
      })
    },
    resetLogBuildSelection() {
      console.log('resetLogBuildSelection')
      this.$refs.logBuildTable.clearSelection()
      this.builds.forEach(item => {
        if (this.checkSelectable(item) && item.buildNum === this.buildNum) {
          this.$refs.logBuildTable.toggleRowSelection(item)
        }
      })
    },
    handleFilter() {
      this.fetchLogList(true)
    },
    handleSelectionChange(selections) {
      this.selectLogs = selections
    //   console.log(this.selectLogs)
    },
    showError(index) {
      console.log(`showError:${index} ${(this.errors & index) > 0}`)
      return (this.errors & index) > 0
    },
    handleCreate() {
      var appIndex = this.appNameDisplayOptions.indexOf(this.appNameDisplay)
      var appName = this.appNameOptions[appIndex]
      var osType = this.osTypes[appIndex]
      var buildNum = this.buildNum
      var selectLogs = this.selectLogs
      var relativebuildNum = this.relativebuildNum
      var error = 0
      if (!appName) error |= 1
      var buildNumInt = parseInt(buildNum, 10)
      if (!buildNumInt || buildNumInt <= 0) error |= 2
      if (!this.isIOS && (!selectLogs || selectLogs.length === 0)) error |= 4
      var relativebuildNumInt = parseInt(relativebuildNum, 10)
      //   if (!buildNumInt || relativebuildNumInt <= 0) error |= 8

      console.log(buildNum)
      this.errors = error
      console.log(this.errors)
      if (error > 0) {
        this.$notify.error('参数异常')
        return
      }
      const loading = this.$loading({
        target: '#dialog-body',
        lock: true,
        text: '创建中，请稍等',
        spinner: 'el-icon-loading',
        background: 'rgba(256, 256, 256, 0.8)'
      })
      var data = { osType, appName, buildNum: buildNumInt, logs: selectLogs }
      data.relativebuildNum = relativebuildNumInt
      createReport(data).then(response => {
        console.log(`createReport response:${JSON.stringify(response)}`)
        loading.close()
        if (response.status === true) {
          this.$emit('dismiss')
          this.$emit('create-success', { osType, appName, buildNum })
          this.$message.success('创建成功')
        } else {
          this.$message.error({
            message: '创建失败'
          })
        }
      })
    },
    handlePreviewBuildDetail(build) {
      console.log(`preview:${build.jenkinsInfo.url}`)
      window.open(build.jenkinsInfo.url, '_blank')
    },
    checkSelectable(build) {
    //   var buildNum = parseInt(this.buildNum)
    //   var relaBuildNum = parseInt(this.relativebuildNum)
      //   return (!relaBuildNum || build.buildNum > relaBuildNum) && build.buildNum <= buildNum
      return build.hasLogDir
    },
    tableRowStyle({ row, rowIndex }) {
      return !row.hasLogDir ? {
        'color': '#3333'
      } : {}
    //   return row.isNew ? 'success-row' : ''
    },
    logTextStyle(build) {
      const selectable = this.checkSelectable(build)
      return selectable ? 'log-text' : 'log-text-diable'
    }
  }

}
</script>
<style lang='scss' scoped>

.filter-item{
    margin-left: 1px;
}
.dialog-footer{
   display: flex;
   justify-content: right;
   margin-top: 10px;
}
.error-text{
    color: red;
}
.log-text{

}
.log-text-diable{
    color: #3333;
}

</style>
