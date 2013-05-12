#!/usr/bin/env bash

package_file_name="`pwd`/JsLib.pack.js"

echo -n "" > $package_file_name

for source_file in  src/vendor/patches/Function.js \
                    src/vendor/patches/Object.js \
                    src/vendor/patches/String.js \
                    src/vendor/HTMLElement/Adaptors.js \
                    src/vendor/dom/events/Delegator.js \
                    src/vendor/events/Dispatcher.js \
                    src/vendor/events/Event.js \
                    src/vendor/Object/ApplicationEvents.js \
                    src/vendor/Object/Callbacks.js \
                    src/vendor/ModuleFactory.js \
                    src/vendor/Template.js \
                    src/framework/views/BaseView.js \
                    src/vendor/BaseView/Forms.js \
                    src/framework/models/BaseModel.js \
                    src/vendor/BaseModel/TemplateDataKeys.js \
                    src/framework/modules/BaseModule.js \
                    src/framework/application/Application.js \
                    demo/store/js/app/models/products/Base.js \
                    demo/store/js/app/modules/products/CreateModule.js \
                    demo/store/js/app/modules/LoginModule.js \
                    demo/store/js/app/modules/TaskListModule.js \
                    demo/store/js/app/modules/SelectionManagerModule.js
                    
do
  echo "Packing $source_file"
  (echo "/* File: $source_file */" && cat $source_file && echo "") >> $package_file_name
done

echo "Finishing packing files into $package_file_name"

exit $?

