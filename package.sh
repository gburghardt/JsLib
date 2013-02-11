#!/usr/bin/env bash

package_file_name="`pwd`/JsLib.pack.js"

echo -n "" > $package_file_name

for source_file in  src/lib/patches/Function.js \
                    src/lib/patches/Object.js \
                    src/lib/patches/String.js \
                    src/lib/HTMLElement/Adaptors.js \
                    src/lib/dom/events/Delegator.js \
                    src/lib/events/Dispatcher.js \
                    src/lib/events/Event.js \
                    src/lib/Object/ApplicationEvents.js \
                    src/lib/Object/Callbacks.js \
                    src/lib/ModuleFactory.js \
                    src/lib/Template.js \
                    src/framework/views/BaseView.js \
                    src/lib/BaseView/Forms.js \
                    src/framework/models/BaseModel.js \
                    src/lib/BaseModel/TemplateDataKeys.js \
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

