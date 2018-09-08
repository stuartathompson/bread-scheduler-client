<template>
  <div class="records bg-light">
    <b-modal id="modalPrevent_record" centered @ok="deleteRecord" ok-variant="danger" title="Delete this record" header-bg-variant="dark" header-text-variant="light" ok-title="Delete">
      Are you sure you want to delete case #{{record_id}}?
    </b-modal>
    <b-modal id="modalPrevent_follow" centered @ok="deleteFollowUp" ok-variant="danger" title="Delete this follow up" header-text-variant="light" header-bg-variant="dark" ok-title="Delete"">
      <p>Are you sure you want to delete this follow-up record?</p>
    </b-modal>
    <div class="container-fluid p-5">
      <div class="row">
          <div class="col-8">
            <h3 class="mb-4">Case #{{record_id}}
            <b-btn variant="primary" v-if="editing"  @click="updateRecord()" class="noprint float-right">Save</b-btn>
            <b-btn v-else @click="startEditing()" class="noprint float-right">Edit</b-btn>
            </h3>
          </div>
          <div class="col-8 mb-2">
            <div class="card">
              <div :id="_id" class="card-body">
                <h5>Case Information
                </h5>
                <table class="table">
                    <tr>
                      <th width="150px">
                        <label>Case Number</label>
                      </th>
                      <td>
                        <input v-if="editing" class="form-control" type="text" v-model="record_id">
                        <span v-else>{{ record_id }}</span>
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <label>Date</label>
                      </th>
                      <td>
                        <datepicker v-if="editing" :bootstrap-style="true" input-class="form-control" v-model="date" :format="customFormatter"></datepicker>
                        <span v-else>{{ date | date }}</span>
                      </td>
                    </tr>
                  <tr>
                    <th width="150px">
                      <label>Description</label>
                    </th>
                    <td>
                      <textarea v-if="editing" rows="6" placeholder="Description" v-model="description" class="form-control"></textarea>
                      <span v-else>{{ description }}</span>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <label>Notes</label>
                    </th>
                    <td>
                      <textarea v-if="editing" rows="6" placeholder="Notes" v-model="notes" class="form-control"></textarea>
                      <span v-else>{{ notes }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <b-btn variant="primary" v-if="editing"  @click="updateRecord()" class="noprint">Save</b-btn>
                      <b-link :href="_id | anchor" v-else @click="startEditing()" class="noprint">Edit</b-link>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <div class="pull-right col-4 mb-2">
            <div class="card pull-right mb-2">
              <div class="card-body">
                <h5>Case Timeline</h5>
                <table class="table">
                  <tr>
                    <th>{{ date | date }}</th>
                    <td>Case created</td>
                  </tr>
                  <tr v-for="child in children">
                    <th>{{ child.date | date }}</th>
                    <td><b-link :href="child._id | anchor">{{ child.title }}</b-link></td>
                  </tr>
                </table>
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <h5>Attachments</h5>
                <input v-if="editing" type="file" class="" value="Attach a file"/>
                <span v-else>Attachments coming soon.</span>
              </div>
            </div>
          </div>
          <div v-for="child in children" class="col-8 mb-2">
            <div :id="child._id" class="card" :data-child_order="child.child_order">
              <div class="card-body">
                <h5>Follow Up #{{ child.child_order + 1}} <span v-if="child.title"> – {{child.title}}</span>
                </h5>
                <table class="table">
                  <tr>
                    <th width="150px">
                      <label>Type</label>
                    </th>
                    <td>
                      <input v-if="editing" type="text" rows="6" placeholder="Ex. Phone call"  class="form-control" v-model="child.title" />
                      <span v-else>{{ child.title }}</span>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <label>Date</label>
                    </th>
                    <td>
                    <datepicker v-if="editing" :bootstrap-style="true" input-class="form-control" v-model="child.date" :format="customFormatter"></datepicker>
                    <span v-else>{{ child.date | date }}</span>
                    </td>
                  </tr>
                    <th width="150px">
                      <label>Description</label>
                    </th>
                    <td>
                      <textarea v-if="editing" rows="6" placeholder="Description"  class="form-control" v-model="child.description"></textarea>
                      <span v-else>{{ child.description }}</span>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <label>Notes</label>
                    </th>
                    <td>
                      <textarea v-if="editing" rows="6" v-model="child.notes" placeholder="Notes" class="form-control"></textarea>
                      <span v-else>{{ child.notes }}</span>
                    </td>
                  </tr>
                  <tr>
                    <th>Reminder notice</th>
                    <td>
                      <b-form-checkbox v-if="editing" class="mt-2 mb-2 mr-sm-2 mb-sm-0">Send me a reminder <br /><small>Select this to get a reminder email the day before this date.</small></b-form-checkbox>
                      <span v-else>Reminder set</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <b-btn variant="primary" v-if="editing"  @click="updateRecord()" class="noprint mr-2">Save</b-btn>
                      <b-link variant="secondary" v-if="editing"  @click="updateRecord()" class=" noprint text-secondary">Cancel </b-link>
                      <b-link :href="_id" v-else @click="startEditing()" class=" noprint">Edit</b-link>
                      <b-link v-b-modal.modalPrevent_follow @click="activeDeleteFollowUp(child._id)" href="#" class="float-right text-danger">Delete this follow-up</b-link>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
        <!--
        <div class="row mb-2">
            <div class="col-2">
              <div class="card">
                <div class="card-body">
                  <h4>Add phone call follow up</h4>
                  <b-button variant="primary">Add</b-button>
                </div>
              </div>
            </div>
            <div class="col-2">
              <b-card>
                  <h4>Add follow up visit</h4>
                  <b-button variant="primary">Add</b-button>
              </b-card>
            </div>
            <div class="col-2">
              <b-card>
                <h5>Add court date</h5>
                <b-button variant="primary">Add</b-button>
              </b-card>
            </div>
          </div>
          -->
          <div class="row mb-2 noprint">
            <div class="col-8 mb-4">
              <b-card>
                <b-link v-on:click="addFollowUp" href="#" class="btn btn-primary">
                  Add follow-up
                </b-link>
              </b-card>
            </div>
          </div>
          <div class="row mb-2 mt-2 noprint">
            <div class="col-8">
                  <p v-if="editing">
                    <button class="btn btn-primary app_record_btn" @click="updateRecord">Save</button>
                  </p>
                  <p>
                    <b-link variant="danger" href="#" v-b-modal.modalPrevent_record class="text-danger">
                      Delete record
                    </b-link>
                </p>
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
  name: 'editrecord',
  data () {
    return {
      _id: '',
      record_id: '',
      description: '',
      notes: '',
      date: '',
      children: [],
      editing: false,
      datePickerOptions: {
        format: 'MMMM, D YYYY',
        useCurrent: true
      },
      activeDeleteId: null
    }
  },
  mounted () {
    this.getRecord()
  },
  filters: {
    anchor: function (value) {
      return '#' + value
    },
    date: function (value) {
      if (!value) return
      return moment(value).format('MMMM D, YYYY')
    }
  },
  components: {
    Datepicker
  },
  methods: {
    customFormatter (date) {
      return moment(date).format('MMMM D, YYYY')
    },
    async getRecord () {
      const response = await RecordsService.getRecord({
        id: this.$route.params.id
      })
      this.record_id = response.data.record_id
      this.description = response.data.description
      this.notes = response.data.notes
      this.date = response.data.date
      this.children = response.data.children === null ? [] : response.data.children
    },
    addFollowUp () {
      this.editing = true
      this.children.push({
        _id: 'follow_up_temp_' + this.children.length,
        child_order: this.children.length,
        record_id: '',
        description: '',
        notes: '',
        date: '',
        title: ''
      })
      location.hash = '#' + 'follow_up_temp_' + (this.children.length - 1)
    },
    startEditing () {
      this.editing = true
    },
    activeDeleteFollowUp (id) {
      this.activeDeleteId = id
    },
    async deleteFollowUp () {
      const $this = this
      if (!$this.activeDeleteId) return
      // Remove follow up from order
      for (var i = 0; i < $this.children.length; i++) {
        if ($this.children[i]._id === $this.activeDeleteId) {
          $this.children.splice(i, 1)
          break
        }
      }
      $this.activeDeleteId = null
      // Update record
      $this.updateRecord()
    },
    async deleteRecord () {
      await RecordsService.deleteRecord(this.$route.params.id)
      this.$router.push({ name: 'Records' })
    },
    async updateRecord () {
      // Clear empty children
      for (var i in this.children) {
        var found = false
        for (var j in this.children[i]) {
          if (j !== '_id' && j !== 'child_order' && this.children[i][j] !== '') {
            found = true
            break
          }
        }
        if (!found) {
          this.children.splice(i, 1)
        }
      }
      await RecordsService.updateRecord({
        id: this.$route.params.id,
        record_id: this.record_id,
        description: this.description,
        notes: this.notes,
        date: this.date,
        children: this.children
      })
      this.editing = false
    }
  }
}
</script>
