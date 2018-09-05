<template>
  <div class="records container-fluid p-5">
    <div class="row">
      <div class="col-12">
          <h3 class="mb-3">Your Cases</h3>
          <b-row class="mb-3">
            <b-col md="6">
              <b-input-group>
                <b-form-input @keyup.native="searchRecord" v-model="filter" placeholder="Search by Case Number" />
                <b-input-group-append>
                  <b-btn :disabled="!filter" @click="filter = '';searchRecord()">Clear</b-btn>
                </b-input-group-append>
              </b-input-group>
            </b-col>
            <router-link v-bind:to="{ name: 'addrecord' }" tag="button" class="btn btn-primary float-right">New Case</router-link>
          </b-row>
          <div v-if="records.length > 0" class="table-wrap">
            <b-table id="records-table" striped hover :items="records" :fields="fields" :per-page="25">
              <template slot="record_id" slot-scope="row">
                  <router-link v-bind:to="{ name: 'editrecord', params: { id: row.item._id } }">
                    {{ row.item.record_id }}
                  </router-link>
              </template>
            </b-table>
            <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" aria-controls="records-table" class="my-0" />
          </div>
          <div v-else>
            There are no records. Add one now to get started. <br /><br />
            <router-link v-bind:to="{ name: 'addrecord' }" class="btn btn-primary btn-small">Add Record</router-link>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import RecordsService from '@/services/RecordsService'
import moment from 'moment'
export default {
  name: 'records',
  data () {
    return {
      records: [],
      fields: [
        {
          key: 'record_id', label: 'Case Number', sortable: true
        },
        {
          key: 'description', sortable: true
        },
        {
          key: 'date',
          filter: 'date',
          sortable: true,
          formatter: (value) => {
            return moment(value).format('MMMM D, YYYY')
          }
        },
        {
          key: 'notes', sortable: true
        }
      ],
      perPage: 5,
      currentPage: 1,
      filter: null,
      totalRows: 0,
      allRecords: null
    }
  },
  mounted () {
    this.getRecords()
  },
  filters: {
    date: function (value) {
      if (!value) return
      return moment(value).format('D MMM, YYYY')
    }
  },
  methods: {
    async getRecords () {
      const response = await RecordsService.fetchRecords()
      this.records = response.data.records
      this.allRecords = this.records
      this.totalRows = this.records.length
    },
    async searchRecord () {
      if (this.filter === '') {
        this.records = this.allRecords
        this.totalRows = this.records.length
        return
      }
      const response = await RecordsService.searchRecord({record_id: this.filter})
      this.records = response.data.records
      this.totalRows = this.records.length
    },
    async deleteRecord (id) {
      const $this = this
      $this.$swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(function () {
        RecordsService.deleteRecord(id)
        $this.$router.go({
          path: '/'
        })
      })
    }
  }
}
</script>
