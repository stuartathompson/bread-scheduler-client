<template>
  <div>
    <div v-if="record.record_id !== ''" class="edit-record pt-1 pl-3 pb-3 pr-3">
      <b-modal id="modalPrevent_record" centered @ok="deleteRecord" ok-variant="danger" title="Delete this record" header-bg-variant="dark" header-text-variant="light" ok-title="Delete">
        Are you sure you want to delete case #{{record.record_id}}?
      </b-modal>
      <b-modal id="modalPrevent_follow" centered @ok="deleteFollowUp" ok-variant="danger" title="Delete this follow up" header-text-variant="light" header-bg-variant="dark" ok-title="Delete">
        <p>Are you sure you want to delete this follow-up record?</p>
      </b-modal>
      <div>
      <!-- class="container-fluid p-3 p-sm-3 p-md-5"> -->
        <b-navbar class="bg-light mb-4 pt-4 pt-xl-3 pb-3 pl-0 pr-0" sticky>
          <b-btn @click="startEditing('all')" v-if="!editing">Edit</b-btn>
          <b-btn v-show="editing" variant="primary" @click="updateRecord(true)" :disabled="!editing" class="mr-3">Save</b-btn>
          <b-link variant="secondary" @click="cancelEdit" v-if="editing">Cancel</b-link>
          <div class="ml-auto">
            <b-link variant="" class="mr-3" @click="closeRecord"><close-icon class="text-extra-large"></close-icon></b-link>
          </div>
        </b-navbar >
        <div class="row">
            <div class="col-12 col-xl-8">
              <h4 class="mb-4">Case #<span :class="(record.record_id === '' ? ' animated-background' : '')">{{record.record_id}}</span>
              </h4>
            </div>
            <div class="col-12 col-xl-8 mb-4">
              <div class="card">
                <div class="card-body">
                  <h5>Case Information
                    <b-link v-show="!editing" @click="startEditing(record.record_id)":href="record.record_id | anchor"><edit-icon class="float-right"></edit-icon></b-link>
                    <b-link variant="secondary" class="float-right text-small text-lightweight" v-show="editing && editing_id === ''" @click="cancelEdit" href="#">Cancel</b-link>
                  </h5>
                  <table class="table">
                      <tr>
                        <th class="d-none d-sm-table-cell" width="150px">
                          <label>Case Number</label>
                        </th>
                        <td>
                          <label class="d-sm-none text-muted">Case Number<br  /></label>
                          <span :class="'d-block' + (record.record_id === '' ? ' animated-background' : '')">{{ record.record_id }}</span>
                        </td>
                      </tr>
                      <tr>
                        <th class="d-none d-sm-block">
                          <label>Date</label>
                        </th>
                        <td>
                          <label class="d-sm-none text-muted">Date<br  /></label>
                          <datepicker id="date" @blur="blurEditing" @keyup.esc="escapeEditing" @keyup.enter="submitEditing" v-if="activeEdit(record.record_id) || singleFieldEditId == 'date'" :bootstrap-style="true" input-class="form-control" v-model="record.date" :format="customFormatter"></datepicker>
                          <span :class="'editable w-100 d-block' + (record.record_id === '' ? ' animated-background' : '')" v-else @click="startEditingSingleField('date')">{{ record.date | date }} <edit-icon></edit-icon></span>
                        </td>
                      </tr>
                    <tr v-if="record.description || editing">
                      <th class="d-none d-sm-block"  width="150px">
                        <label>Description</label>
                      </th>
                      <td>
                        <label class="d-sm-none text-muted">Description<br  /></label>
                        <textarea  id="description" @blur="blurEditing" @keyup.esc="escapeEditing" @keyup.enter="submitEditing" v-if="activeEdit(record.record_id) || singleFieldEditId == 'description'" rows="6" placeholder="" v-model="record.description" class="form-control"></textarea>
                        <span :class="'w-100 d-block' + (record.record_id === '' ? ' animated-background' : '')" v-else @click="startEditingSingleField('description')">{{ record.description }}</span>
                      </td>
                    </tr>
                    <tr v-if="record.notes || editing">
                      <th class="d-none d-sm-block">
                        <label>Notes</label>
                      </th>
                      <td>
                        <label class="d-sm-none text-muted">Notes<br  /></label>
                        <textarea id="notes" @blur="blurEditing" @keyup.esc="escapeEditing" @keyup.enter="submitEditing" v-if="activeEdit(record.record_id) || singleFieldEditId == 'notes'" rows="6" placeholder="" v-model="record.notes" class="form-control"></textarea>
                        <span :class="'w-100 d-block' + (record.record_id === '' ? ' animated-background' : '')" v-else @click="startEditingSingleField('notes')">{{ record.notes }}</span>
                      </td>
                    </tr>
                  </table>
                  <hr />
                  <h5>Case Files</h5>
                  <div>
                    <!-- show upload button -->
                    <table class="table no-top-line">
                      <tr v-for="attachment in record.attachments" class="show-close-on-hover">
                        <td>
                          <a target="_blank" :href="attachment.secure_url"><file-icon></file-icon> {{ attachment.filename}}</a>
                        </td>
                        <td>
                          <b-link href="#" variant="danger" class="float-right"><close-icon></close-icon></b-link>
                        </td>
                      </tr>
                      <tr v-show="uploadStarted">
                        <td colspan="2">
                          <loading-icon></loading-icon>
                        </td>
                      </tr>
                    </table>
                    <form>
                      <label @click="setFileUploadId()" for="file" class="btn btn-sm text-muted">
                        <plus-icon></plus-icon> Upload
                      </label>
                      <input hidden type="file" id="file" ref="file" @change="onFileChange()" name="attachments" multiple class=""/>
                    </form>
                  </div>
                  <!-- <hr /> -->
                  <!-- <b-btn variant="primary" v-if="activeEdit(record.record_id)"  @click="updateRecord()" class="noprint">Save</b-btn> -->
                  <!-- <b-link v-else @click="startEditing(record.record_id)" class="noprint">Edit</b-link> -->

                </div>
              </div>
            </div>

            <div class="pull-right col-12 col-xl-4 mb-4">
              <div class="card pull-right mb-2">
                <div class="card-body p-md-3">
                  <h5>Case Timeline
                  </h5>
                  <table class="table">
                    <tr>
                      <th style="max-width:150px" class="d-sm-table-cell d-md-none d-lg-table-cell">
                        <span :class="'text-muted' + (record.record_id === '' ? ' animated-background' : '')">{{ record.date | date }}</span>
                      </th>
                      <td>
                        <span class="d-sm-none d-md-block d-none d-lg-none text-muted">{{ record.date | date }} <br /></span>
                        Case created
                      </td>
                    </tr>
                    <tr v-for="child in record.children">
                      <th style="max-width:150px" class="d-sm-table-cell d-md-none d-lg-table-cell">
                        <span class="text-muted" v-if="child.date">{{ child.date | date }}<br /></span>
                      </th>
                      <td>
                        <span v-if="child.date" class="text-muted d-none d-sm-none d-md-block d-lg-none ">{{ child.date | date }}<br /></span>
                        <b-link @click="anchor(child.record_id)" href="#">{{ child.title }}</b-link>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            <div v-for="child in record.children" class="col-12 col-xl-8 mb-4">
              <div :id="child.record_id" class="card" :data-child_order="child.child_order">
                <div class="card-body">
                  <h5>Follow Up #{{ child.child_order + 1}} <span v-if="child.title"> – {{child.title}}</span>
                    <b-link v-show="!editing && editing_id !== child.record_id" @click="startEditing(child.record_id)":href="child.record_id | anchor"><edit-icon class="float-right"></edit-icon></b-link>
                    <b-link variant="secondary" class="float-right text-small text-lightweight" v-show="editing && editing_id === child.record_id" @click="cancelEdit" href="#">Cancel</b-link>
                  </h5>
                  <table class="table">
                    <tr>
                      <th class="d-none d-sm-table-cell" width="150px">
                        <label>Type</label>
                      </th>
                      <td>
                        <label class="d-sm-none text-muted">Type<br  /></label>
                        <input :id="child.record_id+'child.title'" @blur="blurEditing" @keyup.esc="escapeEditing" @keyup.enter="submitEditing" v-if="activeEdit(child.record_id) || singleFieldEditId == child.record_id+'child.title'" type="text" rows="6" placeholder="Ex. Phone call"  class="form-control" v-model="child.title" />
                        <span class="w-100 d-block" v-else @click="startEditingSingleField(child.record_id+'child.title')">{{ child.title }}</span>
                      </td>
                    </tr>
                    <tr>
                      <th class="d-none d-sm-block">
                        <label>Date</label>
                      </th>
                      <td>
                        <label class="d-sm-none text-muted">Date<br  /></label>
                        <datepicker :id="child.record_id+'child.date'" @blur="blurEditing" @keyup.esc="escapeEditing" @keyup.enter="submitEditing" v-if="activeEdit(child.record_id) || singleFieldEditId == child.record_id+'child.date'" :bootstrap-style="true" input-class="form-control" v-model="child.date" :format="customFormatter"></datepicker>
                        <span class="w-100 d-block" v-else @click="startEditingSingleField(child.record_id+'child.date')">{{ child.date | date }}</span>
                      </td>
                    </tr>
                      <th class="d-none d-sm-block">
                        <label>Description</label>
                      </th>
                      <td>
                        <label class="d-sm-none text-muted">Description<br  /></label>
                        <textarea :id="child.record_id+'child.description'" @blur="blurEditing" @keyup.esc="escapeEditing" @keyup.enter="submitEditing" v-if="activeEdit(child.record_id) || singleFieldEditId == child.record_id+'child.description'" placeholder=""  class="form-control" v-model="child.description"></textarea>
                        <span class="w-100 d-block" v-else @click="startEditingSingleField(child.record_id+'child.description')">{{ child.description }}</span>
                      </td>
                    </tr>
                    <tr>
                      <th class="d-none d-sm-block">
                        <label>Notes</label>
                      </th>
                      <td>
                        <label class="d-sm-none text-muted">Notes<br  /></label>
                        <textarea  :id="child.record_id+'child.notes'" @blur="blurEditing" @keyup.esc="escapeEditing" @keyup.enter="submitEditing" v-if="activeEdit(child.record_id) || singleFieldEditId == child.record_id+'child.notes'" v-model="child.notes" placeholder="" class="form-control"></textarea>
                        <span class="w-100 d-block" v-else @click="startEditingSingleField(child.record_id+'child.notes')">{{ child.notes }}</span>
                      </td>
                    </tr>
                    <!-- <tr>
                      <th class="d-none d-sm-block">Reminder notice</th>
                      <td>
                        <label class="d-sm-none text-muted">Reminder notice<br  /></label>
                        <b-form-checkbox :id="child.record_id+'child.reminder'" v-if="activeEdit(child.record_id) || singleFieldEditId == child.record_id+'child.reminder'" class="mt-2 mb-2 mr-sm-2 mb-sm-0">Send me a reminder <br /><small>Select this to get a reminder email the day before this date.</small></b-form-checkbox>
                        <span class="w-100 d-block" v-else @click="startEditingSingleField(child.record_id+'child.reminder')">Reminder set</span>
                      </td>
                    </tr> -->
                  </table>
                  <hr />
                  <h5>Follow-up Files</h5>
                    <!-- show upload button -->
                    <table class="table no-top-line">
                      <tr v-for="attachment in child.attachments" class="show-close-on-hover">
                        <td>
                          <a target="_blank" :href="attachment.secure_url"><file-icon></file-icon> {{ attachment.filename}}</a>
                        </td>
                        <td>
                          <b-link href="#" variant="danger"><close-icon class="float-right"></close-icon></b-link>
                        </td>
                      </tr>
                      <tr v-show="uploadStarted">
                        <td colspan="2">
                          <loading-icon></loading-icon>
                        </td>
                      </tr>
                    </table>

                    <form>
                      <label @click="setFileUploadId(child.record_id)" for="file" class="btn btn-sm text-muted">
                        <plus-icon></plus-icon> Upload
                      </label>
                    </form>
                  <table class="table">
                    <tr>
                      <td colspan="2">
                        <!-- <b-btn variant="primary" v-if="activeEdit(child.record_id)"  @click="updateRecord()" class="noprint mr-2">Save</b-btn> -->
                        <!-- <b-link variant="secondary" v-if="activeEdit(child.record_id)"  @click="cancelEdit()" class=" noprint text-secondary">Cancel </b-link> -->
                        <!-- <b-link click="#edit" v-else @click="startEditing(child.record_id)" class=" noprint">Edit</b-link> -->
                        <b-link v-b-modal.modalPrevent_follow @click="activeDeleteFollowUp(child.record_id)" href="#" class="float-right text-danger">Delete this follow-up</b-link>
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
              <div class="col-12 col-xl-8 mb-4">
                <b-card>
                  <b-link v-on:click="addFollowUp" href="#" class="btn btn-primary">
                    Add follow-up
                  </b-link>
                  <b-link variant="danger" href="#" v-b-modal.modalPrevent_record class="text-danger float-right mt-1">
                    Delete record
                  </b-link>
                </b-card>
              </div>
            </div>
            <div class="row mb-2 mt-2 noprint">
              <div class="col-8">
                    <p v-if="editing_id == record.record_id">
                      <button class="btn btn-primary app_record_btn" @click="updateRecord(true)">Save</button>
                    </p>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecipeService from '@/services/RecipeService'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'editRecord',
  data () {
    return {
      // record: {
      //   record_id: '',
      //   description: '',
      //   notes: '',
      //   date: '',
      //   children: [],
      //   attachments: []
      // },
      datePickerOptions: {
        format: 'MMMM, D YYYY',
        useCurrent: true
      },
      newAttachments: {},
      newAttachments_child: {},
      attachments: [],
      attachments_results: [],
      attachments_results_child: [],
      activeImageUploadId: '',
      attachments_view: 'stacked',
      activeDeleteId: null,
      uploadStarted: false,
      beforeEditingCache: {},
      singleFieldEditId: null
    }
  },
  computed: {
    newAttachmentsByRecord (record) {
      var matchAttachments = []
      for (var attachment of this.newAttachments) {
        if (attachment.record_id === record.record_id) {
          matchAttachments.push(attachment)
        }
      }
      return matchAttachments
    },
    editing: function () {
      return this.$store.state.editing
    },
    editing_id: function () {
      return this.$store.state.editing_id
    },
    record: function () {
      return this.$store.state.record
    }
  },
  created () {
    this.$store.commit('editing', false)
    // this.getRecord()
  },
  filters: {
    childFile: function (d) {
      return 'file_' + d
    },
    anchor: function (value) {
      // return window.location.href + '?anchor=' + value
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
    anchor (id) {
      var elmnt = document.getElementById(id)
      if (elmnt !== null) {
        elmnt.scrollIntoView({
          behavior: 'smooth'
        })
      }
    },
    activeEdit: function (recordId) {
      return recordId && (this.$store.state.editing_id === recordId || this.$store.state.editing_id === 'all')
    },
    customFormatter (date) {
      return date ? moment(date).format('MMMM D, YYYY') : ''
    },
    async getRecord (record) {
      if (!record) record = {_id: this.$route.path.replace('edit', '').replace(/\//gi, '')}
      if (record._id !== '') {
        // window.location.hash = `${record._id}/edit`
        this.$router.push({ path: `${record._id}/edit` })
        this.$store.dispatch('getRecord', record)
      }
      // console.log('record', record)
      // const response = await RecipeService.getRecord({
      //   id: record._id
      // })
      // console.log('response', response)
      // this.record.record_id = response.data.record_id
      // this.record.description = response.data.description
      // this.record.notes = response.data.notes
      // this.record.date = response.data.date
      // this.record.attachments = response.data.attachments
      // this.record.children = response.data.children === null ? [] : response.data.children
    },
    addFollowUp () {
      let id = 'follow_up_' + this.record.children.length
      this.record.children.push({
        record_id: id,
        child_order: this.record.children.length,
        description: '',
        notes: '',
        date: '',
        title: ''
      })
      this.$store.state.editing_id = id
      this.startEditing()
      // // Move into view
      // this.$nextTick(function () {
      //   this.anchor(id)
      // })
    },
    cancelEdit () {
      // this.$store.state.editing = false
      this.$store.commit('editing', false)
      this.$store.commit('editing_id', null)
      if (this.beforeEditingCache !== null) {
        this.$store.commit('record', this.beforeEditingCache)
      }
      this.beforeEditingCache = null
    },
    blurEditing () {
      // If editing a single field, update the record
      if (this.singleFieldEditId !== null) {
        this.singleFieldEditId = null
        this.updateRecord(true)
      }
    },
    submitEditing () {
      // If editing a single field, update the record
      this.updateRecord(true)
    },
    escapeEditing () {
      this.singleFieldEditId = null
      this.cancelEdit()
    },
    startEditingSingleField (id) {
      // this.$store.state.editing = true
      this.$store.commit('editing', true)
      this.singleFieldEditId = id
      this.beforeEditingCache = JSON.parse(JSON.stringify(this.$store.state.record))
      this.$nextTick(function () {
        document.getElementById(id).focus()
      })
    },
    startEditing (id) {
      // this.$store.state.editing = true
      this.$store.commit('editing', true)
      var editingId = id !== undefined ? id : this.$store.state.editing_id
      this.$store.commit('editing_id', editingId)
      this.singleFieldEditId = null
      // Save copy of edited data
      this.beforeEditingCache = JSON.parse(JSON.stringify(this.$store.state.record))
      // Move into view
      this.$nextTick(function () {
        this.anchor(this.$store.state.editing_id)
      })
    },
    activeDeleteFollowUp (id) {
      this.activeDeleteId = id
    },
    async deleteFollowUp () {
      const $this = this
      if (!$this.activeDeleteId) return
      // Remove follow up from order
      for (var i = 0; i < $this.record.children.length; i++) {
        if ($this.record.children[i].record_id === $this.activeDeleteId) {
          $this.record.children.splice(i, 1)
          break
        }
      }
      $this.activeDeleteId = null
      // Update record
      $this.updateRecord(true)
    },
    async deleteRecord () {
      await RecipeService.deleteRecord(this.$route.params.id)
      this.$router.push({ name: 'Records' })
    },
    setFileUploadId (id) {
      this.activeImageUploadId = id
    },
    onFileChange (id) {
      this.newAttachments = this.$refs.file.files
      this.uploadAttachment()
    },
    async uploadAttachment () {
      this.uploadStarted = true
      var data = new FormData()
      for (var attachment of this.newAttachments) {
        data.append('file', attachment)
      }
      // data.append('file', this.attachments)
      let response = await RecipeService.addImage(data)

      // empt yresponse array
      this.attachments_results = []
      // Build response array
      for (var j in response.data.files) {
        var file = response.data.files[j]
        this.attachments_results.push({
          secure_url: file.secure_url,
          filename: file.originalname,
          attachment_id: file.attachment_id,
          resource_type: file.resource_type,
          format: file.format
        })
      }
      this.updateRecord()
    },
    async updateRecord (finishedEditing) {
      // // Clear empty children
      for (var i in this.record.children) {
        var found = false
        for (var j in this.record.children[i]) {
          // Check relevant fields to see if any are full, if so keep it
          if (j !== 'record_id' && j !== 'child_order' && this.record.children[i][j] !== '') {
            found = true
            break
          }
        }
        if (!found) {
          this.record.children.splice(i, 1)
        }
      }

      // Push the attachment record to the data and just save the data instead
      if (this.attachments_results && this.attachments_results.length > 0) {
        // We have an attachemnt
        if (this.activeImageUploadId) {
          // We have a child image, so append to child
          this.$store.commit('childAttachments', {
            attachments: this.attachments_results,
            record_id: this.activeImageUploadId
          })
        } else {
          // We have a partent image, so append to parent
          this.$store.commit('parentAttachments', {
            attachments: this.attachments_results
          })
        }
      }
      // console.log('pushing this', {
      //   _id: this.$store.state.record._id,
      //   record_id: this.$store.state.record.record_id,
      //   description: this.$store.state.record.description,
      //   notes: this.$store.state.record.notes,
      //   date: this.$store.state.record.date,
      //   children: this.$store.state.record.children,
      //   attachments: this.$store.state.record.attachments
      // })
      // Push child attachment to proper child attachment in vuex
      // this.$store.commit('childAttachments', {attachments: this.attachment_results_child, record_id: this.activeImageUploadId})

      // Save response
      var response = await RecipeService.updateRecord({
        _id: this.$store.state.record._id,
        record_id: this.$store.state.record.record_id,
        description: this.$store.state.record.description,
        notes: this.$store.state.record.notes,
        date: this.$store.state.record.date,
        children: this.$store.state.record.children,
        attachments: this.$store.state.record.attachments
      })
      // Update items
      this.$store.commit('record', response.data.record)
      if (finishedEditing) {
        this.$store.commit('editing', false)
        this.$store.commit('editing_id', '')
      }
      this.uploadStarted = false
    },
    closeRecord () {
      this.$store.commit('editing', false)
      this.$router.push({ name: 'Records' })
      this.$store.commit('editing_id', '')
      this.$store.commit('record', null)
    }
  }
}
</script>
