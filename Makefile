
# `emulator -list-avds` to list all available avds
avd_name := My_Android_34
# Windows user home directory
user_home := $(shell powershell -Command "[System.Environment]::GetFolderPath('UserProfile')")

.PHONY: all

run:
	npm run start

avd-windows:
	$(user_home)\Android-SDK\emulator\emulator.exe -avd $(avd_name)