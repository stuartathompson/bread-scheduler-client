<template>
  <div class="records bg-light">
  <div class="container-fluid p-5">
    <div class="row">
        <div class="col-12">
    <h4 class="mb-4">New case</h4>
    <div class="card">
      <div class="card-body">

    <table class="table no-top-line">
        <tr>
          <th>
            <label>Case Number</label>
          </th>
          <td width="100%">
            <input class="mb-2 form-control" type="text" v-model="record_id">
          </td>
        </tr>
        <tr>
          <th>
            <label>Date</label>
          </th>
          <td>
            <datepicker :bootstrap-style="true" input-class="form-control" v-model="date" :format="customFormatter"></datepicker>
          </td>
        </tr>
        <tr>
          <th>
            <label>Description</label>
          </th>
          <td>
            <textarea rows="6" placeholder="Description" v-model="description" class="form-control"></textarea>
          </td>
        </tr>
        <tr>
          <th>
            <label>Notes</label>
          </th>
          <td>
            <textarea rows="6" placeholder="Notes" v-model="notes" class="form-control"></textarea>
          </td>
        </tr>
        <tr>
          <th><label>Attachments</label></th>
          <td>
            <input type="file" class="" value="Attach a file"/>
          </td>
        </tr>
      </table>
      <div>
        <button class="app_record_btn btn btn-primary" @click="addRecord">Save</button>
      </div>
    </div>
    </div>
  </div>
  </div>
  </div>
  </div>
</template>

<script>
import RecordsService from '@/services/RecordsService'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'addrecord',
  data () {
    return {
      record_id: '',
      description: '',
      notes: '',
      date: '',
      datePickerOptions: {
        format: 'MMMM, D YYYY',
        useCurrent: true
      }
    }
  },
  filters: {
    date: function (value) {
      // if (!value) return
      // console.log(moment)
      return moment(value).format('D MMM, YYYY')
    }
  },
  components: {
    Datepicker
  },
  methods: {
    customFormatter (date) {
      return moment(date).format('MMMM D, YYYY')
    },
    async addRecord () {
      await RecordsService.addRecord({
        record_id: this.record_id,
        description: this.description,
        notes: this.notes,
        date: new Date(this.date)
      })
      this.$router.push({ name: 'Records', params: { message: 'Your record was added.' } })
    }
  }
}
</script>
