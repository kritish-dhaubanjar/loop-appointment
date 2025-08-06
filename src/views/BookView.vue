<script setup>
import { reactive, computed, ref, onBeforeMount } from 'vue'
import { generateCalendar, MONTHS, DAYS } from '../utils/calendar'

const TIME_SLOTS = [
  { label: '7:00am - 8:00am', value: '7:00am' },
  { label: '8:00am - 9:00am', value: '8:00am' },
  { label: '9:00am - 10:00am', value: '9:00am' },
  { label: '10:00am - 11:00am', value: '10:00am' },
  { label: '11:00am - 12:00pm', value: '11:00am' },
  { label: '12:00pm - 1:00pm', value: '12:00pm' },
  { label: '1:00pm - 2:00pm', value: '1:00pm' },
  { label: '2:00pm - 3:00pm', value: '2:00pm' },
  { label: '3:00pm - 4:00pm', value: '3:00pm' },
  { label: '4:00pm - 5:00pm', value: '4:00pm' },
  { label: '5:00pm - 6:00pm', value: '5:00pm' },
  { label: '6:00pm - 7:00pm', value: '6:00pm' },
  { label: '7:00pm - 8:00pm', value: '7:00pm' },
  { label: '8:00pm - 9:00pm', value: '8:00pm' },
  { label: '9:00pm - 10:00pm', value: '9:00pm' }
]
const BOOKED_SLOTS = ref({})

const BOOKED_DATES = computed(() => {
  const dates = Object.keys(BOOKED_SLOTS.value).reduce((dates, date) => {
    dates.add(date)
    return dates
  }, new Set())

  return dates
})

const date = reactive({
  day: new Date().getDate(),
  month: new Date().getMonth(),
  year: new Date().getFullYear()
})

const active = reactive({
  date: { ...date },
  time: []
})

const data = reactive({
  name: '',
  band_name: '',
  no_of_members: '',
  phone_number: '',
  note: '',
  email: ''
})

const step = ref(0)

// Computed
const calendar = computed(() => generateCalendar(date))

// Methods
const next = () => {
  date.month = ++date.month % 12
  if (date.month === 0) {
    ++date.year
  }
}

const previous = () => {
  if (date.month === 0) {
    --date.year
    date.month = 11
  } else {
    --date.month
  }
}

const setDate = (day) => {
  active.date = {
    ...date,
    day
  }
  active.time = []
}

const setTime = (time) => {
  if (active.time.includes(time)) {
    active.time = active.time.filter((timeSlot) => timeSlot !== time)
  } else {
    active.time.push(time)
  }
}

onBeforeMount(async () => {
  const reservationsResponse = await fetch(
    'https://api.loopstudiocafe.com/api/collections/get/reservations'
  )
  const { entries: reservationsData } = await reservationsResponse.json()

  reservationsData.forEach((reservation) => {
    const { reservation_date, band_name, name, note, reservation_time = [] } = reservation

    if (!BOOKED_SLOTS.value[reservation_date]) {
      BOOKED_SLOTS.value[reservation_date] = {}
    }

    reservation_time.forEach((time) => {
      BOOKED_SLOTS.value[reservation_date][time] = {
        band_name,
        name,
        note
      }
    })
  })
})

const handleSubmit = async () => {
  await fetch('https://api.loopstudiocafe.com/api/collections/save/reservations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: {
        ...data,
        reservation_date: new Date(
          active.date.year,
          active.date.month,
          active.date.day
        ).toLocaleDateString('fr-CA'),
        reservation_time: active.time
      }
    })
  })

  step.value++
}
</script>

<template>
  <div class="bg-dark min-vw-100 min-vh-100 d-flex align-items-center py-5">
    <section class="w-100">
      <main class="container text-light rounded-3 border border-light-subtle">
        <div class="row">
          <section class="col-lg-3 p-4 border-end border-light-subtle">
            <div class="text-center mb-3">
              <img src="/loop.png" class="img-fluid" width="100px" />
            </div>

            <h5>LOOP STUDIO CAFE</h5>
            <p>
              LOOP Rehearsal Room understand that musicians need places to study and practice their
              craft. This is why we have created a comprehensive suite of music rooms were specially
              built to be sound-proof and have the best acoustics possible for our both professional
              and new growing musicians.
            </p>

            <ul class="list-group list-unstyled text-small mb-5">
              <li class="py-1"><i class="bi bi-clock me-1"></i> 60 mins</li>
              <li class="py-1">
                <i class="bi bi-geo-alt me-1"></i> Chhabahal, Pulchowk (Gateway to Pimbahal),
                Lalitpur
              </li>
              <li class="py-1"><i class="bi bi-globe me-1" /> Asia/Kathmandu</li>
            </ul>

            <h5>RESERVATION REQUIREMENTS</h5>
            It is the responsibility of all practice room users to adhere to the following
            requirements:
            <ul>
              <li>Request all the members to handle the room gently during session.</li>
              <li>Practice rooms are available by reservation only.</li>
              <li>
                Practice rooms may be reserved up to 3 days in advance, and users are permitted to
                make same-day reservations. (first come first serve)
              </li>
              <li>Practice sessions are limited to 180 minutes maximum (3 hours.)</li>
              <li>Users are permitted a maximum of four (3) reservations per day.</li>
              <li>
                Muscians/Band must abide by practice room reservation times, and may not arrive
                early or stay late.
              </li>
              <li>
                If a practice room has been previously scheduled but is not actively being used we
                can scheduled other timeing.
              </li>
              <li>
                Leave an ID with Reception, sign the entrance time and pick up . When finished using
                the Room, lock the door, leave the key at Reception and sign the exit time.
              </li>
              <li>Do not let other people access the Room.</li>
              <li>
                Reservation shifts must always be followed and the room should be cleared at least 5
                minutes before the end of the reserved time to allow users from the next shift
                access.
              </li>
              <li>For safety reasons, meetings, jam sessions, etc. may not be organized.</li>
              <li>
                The following is absolutely forbidden in the Music Room: − Smoking − Use of alcohol
                and other psychoactive substances − Bringing food and beverages − Bringing glass
                objects − Bringing other inappropriate objects − Moving tools and materials
              </li>
            </ul>
          </section>
          <section
            class="col-lg-6 p-4 border-end border-start border-light-subtle position-relative"
            v-if="step === 0"
          >
            <div class="d-flex justify-content-between">
              <span class="fs-6 fw-semibold">{{ MONTHS[date.month] }} {{ date.year }}</span>

              <div id="chevron">
                <button
                  @click="previous"
                  class="btn rounded-2 border-0"
                  :disabled="
                    date.month === new Date().getMonth() && date.year === new Date().getFullYear()
                  "
                >
                  <i class="text-white bi bi-chevron-left" />
                </button>

                <button @click="next" class="btn rounded-2 border-0">
                  <i class="text-white bi bi-chevron-right" />
                </button>
              </div>
            </div>

            <div class="mb-5 pb-5">
              <div class="row row-cols-7 my-3 text-white text-center g-2">
                <div class="col">SUN</div>
                <div class="col">MON</div>
                <div class="col">TUE</div>
                <div class="col">WED</div>
                <div class="col">THU</div>
                <div class="col">FRI</div>
                <div class="col">SAT</div>
              </div>
              <div
                v-for="(week, index) in calendar"
                :key="index"
                class="row row-cols-7 my-1 text-white text-center g-2"
              >
                <div v-for="day in week" :key="day" class="col">
                  <button
                    v-if="day"
                    @click="setDate(day)"
                    class="btn btn-outline rounded-3 w-100 py-3 position-relative"
                    :disabled="
                      date.month === new Date().getMonth() &&
                      date.year === new Date().getFullYear() &&
                      day < new Date().getDate()
                    "
                    :class="
                      active.date.day === day &&
                      active.date.month === date.month &&
                      active.date.year === date.year
                        ? 'bg-white text-dark'
                        : 'text-white'
                    "
                  >
                    {{ day }}

                    <span
                      v-if="
                        BOOKED_DATES.has(
                          new Date(date.year, date.month, day).toLocaleDateString('fr-CA')
                        )
                      "
                      class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle"
                    >
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <button
              class="btn btn-outline text-white float-end confirm"
              :disabled="!active.time.length"
              @click="step++"
            >
              Confirm
            </button>
          </section>

          <section class="col-lg-6 p-4 position-relative" v-show="step === 1">
            <form class="mb-5 pb-5" @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label fw-semibold">Email address *</label>
                <input
                  type="email"
                  placeholder="kritishdhaubanjar@gmail.com"
                  class="form-control bg-dark text-white"
                  v-model="data.email"
                  required
                />
                <div class="form-text text-white">
                  We'll never share your email with anyone else.
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Name *</label>
                <input
                  type="text"
                  placeholder="Kritish Dhaubanjar"
                  class="form-control bg-dark text-white"
                  required
                  v-model="data.name"
                />
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Name of Band *</label>
                <input
                  type="text"
                  placeholder="Name of Band"
                  class="form-control bg-dark text-white"
                  required
                  v-model="data.band_name"
                />
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Number of members *</label>
                <input
                  type="number"
                  placeholder="Number of members"
                  class="form-control bg-dark text-white"
                  required
                  v-model="data.no_of_members"
                />
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Phone Number (SMS notifications) *</label>

                <div class="input-group mb-3">
                  <span class="input-group-text bg-dark text-white">+977</span>
                  <input
                    type="number"
                    placeholder="9843584612"
                    class="form-control bg-dark text-white"
                    required
                    v-model="data.phone_number"
                  />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold"
                  >Tell us more about your session and how we can help.</label
                >
                <textarea
                  placeholder="Please share anything that will help prepare for your session."
                  rows="5"
                  class="form-control bg-dark text-white"
                  v-model="data.note"
                />
              </div>

              <button
                class="btn btn-outline text-white float-end confirm"
                type="submit"
                :disabled="!active.time.length"
              >
                Confirm
              </button>

              <button
                class="btn btn-outline text-white float-end cancel confirm me-3"
                type="button"
                @click="step--"
                :disabled="!active.time.length"
              >
                Back
              </button>
            </form>
          </section>

          <section class="col-lg-6 p-4 position-relative" v-if="step === 2">
            <h4>This Practice Session is scheduled</h4>
            <p>
              We emailed you and the other attendees a calendar invitation with all the details.
            </p>

            <hr />

            <table class="w-100">
              <tr>
                <td class="fw-bold py-3 pe-4">What</td>
                <td>Rehershal/Practice Room Session</td>
              </tr>
              <tr>
                <td class="fw-bold py-3 pe-4">When</td>
                <td>
                  {{
                    DAYS[new Date(active.date.year, active.date.month, active.date.day).getDay()]
                  }}, {{ MONTHS[active.date.month] }} {{ active.date.day }}, {{ active.date.year
                  }}<br />

                  {{ active.time.join(', ') }}
                  (Nepal Time)
                </td>
              </tr>
              <tr>
                <td class="fw-bold py-3 pe-4">Who</td>
                <td>
                  <b>{{ data.name }}</b> for <b>{{ data.band_name }}</b>
                </td>
              </tr>
              <tr>
                <td class="fw-bold py-3 pe-4">Where</td>
                <td>Loop Studio Cafe, Chhabahal, Pulchowk (Gateway to Pimbahal), Lalitpur</td>
              </tr>
            </table>

            <hr />

            <p>Need to make a change? Call <u>+977 9702454737</u></p>

            <a role="button" class="btn btn-outline text-white float-end confirm" href="/">
              Back
            </a>

            <img src="/qr.jpeg" class="img-fluid my-4" />
          </section>

          <section id="time" class="col-lg-3 p-4">
            <span class="fs-6 fw-semibold"
              >{{ DAYS[new Date(active.date.year, active.date.month, active.date.day).getDay()] }},
              {{ MONTHS[active.date.month] }} {{ active.date.day }}, {{ active.date.year }}</span
            >

            <ul class="list-unstyled my-3" v-if="step === 0">
              <li v-for="{ label, value: timeSlot } in TIME_SLOTS" class="mb-2" :key="timeSlot">
                <button
                  v-if="
                    !BOOKED_SLOTS[
                      new Date(
                        active.date.year,
                        active.date.month,
                        active.date.day
                      ).toLocaleDateString('fr-CA')
                    ]?.[timeSlot]
                  "
                  class="btn btn-outline-light btn-sm py-2 w-100 bg-dark fw-semibold"
                  @click="setTime(timeSlot)"
                  :class="active.time.includes(timeSlot) ? 'border-white' : 'border-light-subtle'"
                >
                  {{ label }}
                </button>

                <div v-else class="card text-bg-dark mb-3 w-100">
                  <div class="card-header text-center fw-semibold">{{ label }}</div>
                  <div class="card-body">
                    <h6 class="card-title">
                      {{
                        BOOKED_SLOTS[
                          new Date(
                            active.date.year,
                            active.date.month,
                            active.date.day
                          ).toLocaleDateString('fr-CA')
                        ]?.[timeSlot]?.['band_name']
                      }}
                    </h6>
                    <p class="card-text">
                      {{
                        BOOKED_SLOTS[
                          new Date(
                            active.date.year,
                            active.date.month,
                            active.date.day
                          ).toLocaleDateString('fr-CA')
                        ]?.[timeSlot]?.['note']
                      }}
                    </p>
                    <small class="card-text"
                      >-
                      {{
                        BOOKED_SLOTS[
                          new Date(
                            active.date.year,
                            active.date.month,
                            active.date.day
                          ).toLocaleDateString('fr-CA')
                        ]?.[timeSlot]?.['name']
                      }}</small
                    >
                  </div>
                </div>
              </li>
            </ul>

            <ul class="list-unstyled my-3" v-else>
              <li v-for="timeSlot in active.time" class="mb-2" :key="timeSlot">
                <button
                  class="btn btn-outline-light btn-sm py-2 w-100 bg-dark fw-semibold"
                  disabled
                >
                  {{ TIME_SLOTS.find(({ value }) => value === timeSlot)?.label }}
                </button>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </section>
  </div>
</template>

<style scoped lang="scss">
main {
  background-color: rgb(var(--bs-dark-subtle-rgb));
}

section:nth-child(2) {
  button {
    background: rgb(var(--bs-light-border-subtle-rgb));
    border: 3px solid transparent;

    &:hover {
      border: 3px solid #fff;
    }
  }
}

section:nth-child(4) {
  button {
    &:hover {
      color: var(--bs-white) !important;
      background-color: rgba(var(--bs-dark-subtle-rgb)) !important;
    }
  }
}

#chevron {
  button {
    background: transparent;

    &:hover {
      background-color: rgba(var(--bs-light-border-subtle-rgb)) !important;
    }
  }
}

.confirm {
  right: 24px;
  bottom: 24px;
  background: rgb(var(--bs-light-border-subtle-rgb));
  border: 3px solid transparent;

  &:hover {
    border: 3px solid #fff;
  }
}

.cancel {
  right: 124px;
}

textarea,
input,
span {
  font-size: 14px;

  &::placeholder {
    color: rgb(var(--bs-light-rgb));
    opacity: 0.5;
  }

  border-color: rgb(var(--bs-light-border-subtle-rgb));

  &:focus {
    border-color: #fff;
    box-shadow: 0 0 0 0.25rem rgba(var(--bs-dark-subtle-rgb));
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type='number'] {
    -moz-appearance: textfield;
  }
}

.col {
  width: calc(100% / 7) !important;
}
</style>
