<template>
  <div
    id="settings_container"
    class="window"
  >
    <button
      type="button"
      class="close"
      @click="$emit('close')"
    >
      X
    </button>
    <div id="settings">
      <h2 class="text-4xl">
        {{ $t('settings') }}
      </h2>
      <div class="settings__item">
        <b>{{ $t('settings__background') }}</b>
        <input
          id="background_settings"
          type="color"
          name="background_settings"
          :value="userSettings.backgroundColor"
          @input="($event) => changeSettings('backgroundColor', $event)"
        >
      </div>
      <div class="settings__item">
        <b>{{ $t('settings__color') }}</b>
        <input
          id="background_settings"
          type="color"
          name="background_settings"
          :value="userSettings.textColor"
          @input="($event) => changeSettings('textColor', $event)"
        >
      </div>
      <div class="settings__item">
        <b>{{ $t('settings__position_notify') }}</b>
        <div
          id="notification_position"
          name="notification_position"
        >
          <div
            v-for="position in list_position_notify"
            :key="position"
            class="circle"
            :class="
              userSettings.notification.position === position ? 'active' : null
            "
            @click="changePositionNotify(position)"
          >
            <div class="popup">
              {{ position }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { SetUserSettings, type UserSettings } from './userSettings'

export default defineComponent({
  emits: ['close'],
  data() {
    return {
      list_position_notify: [
        'top_left',
        'top_right',
        'bottom_left',
        'bottom_right',
      ],
      userSettings: window.user_settings,
    }
  },
  methods: {
    changePositionNotify(position: string) {
      this.userSettings.notification.position = position
      SetUserSettings()
    },
    changeSettings(type: keyof UserSettings, event: Event) {
      const target = event.currentTarget as HTMLInputElement
      if (target) {
        switch (type) {
          case 'backgroundColor':
            window.user_settings.backgroundColor = target.value as string
            break
          case 'textColor':
            window.user_settings.textColor = target.value as string
            break
          default:
            break
        }
        SetUserSettings()
      }
    },
  },
})
</script>

<style lang="less">
  #settings {
    display: grid;
    grid-template: auto / 100%;
    > div {
      padding: 1em;
    }
    h2 {
      display: grid;
      align-content: center;
      height: 3em;
      border-bottom: 2px solid currentColor;
    }
    .settings__item {
      display: grid;
      place-items: center;
      width: 80%;
      justify-self: center;
      grid-template-columns: 50% 50%;

      input[type='color'] {
        padding: 0;
        width: 2em;
        height: 2em;
        border-radius: 50%;
        border: 5px solid black;
        cursor: pointer;
      }
      input[type='color']::-webkit-color-swatch-wrapper {
        padding: 0;
        border: none;
        border-radius: 50%;
      }
      input[type='color']::-webkit-color-swatch {
        padding: 0;
        border: none;
        border-radius: 50%;
      }
      div#notification_position {
        padding: 0.5em;
        width: 15em;
        height: 10em;
        border-radius: 15px;
        background-color: white;
        border: 10px solid black;
        display: grid;
        grid-template: 2em 2em / 2em 2em;
        gap: 4em 9em;
        position: relative;
        &::after,
        &::before {
          content: '';
          border: 2px solid black;
          background: white;
          position: absolute;
        }
        &::before {
          width: 20%;
          height: 40px;
          left: 40%;
          bottom: -50px;
        }
        &::after {
          width: 80%;
          height: 1em;
          left: 10%;
          bottom: -4em;
          border-radius: 20px 20px 0px 0px;
        }
        div.circle {
          width: 2em;
          height: 2em;
          padding: 0.5em;
          border-radius: 15px;
          background-color: grey;
          cursor: pointer;
          position: relative;

          &.active {
            background-color: red;
          }
          div.popup {
            display: none;
            position: absolute;
            background-color: rgba(243, 243, 243, 0.881);
            color: black;
            border-radius: 20px;
            padding: 10px;
            left: 0%;
            top: 100%;
          }
        }
        div.circle:hover > div.popup {
          display: block;
        }
      }
    }
  }
</style>
