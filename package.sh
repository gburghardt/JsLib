#!/usr/bin/env bash

package_file_name="`pwd`/JsLib.pack.js"

echo -n "" > $package_file_name

for source_file in  src/lib/patches/Object.js \
                    src/lib/patches/Function.js \
                    src/lib/patches/String.js \
                    src/lib/errors.js \
                    src/lib/dom/events/Delegator.js \
                    src/lib/dom/events/action.js \
                    src/lib/OperationFactory.js \
                    src/lib/events/Dispatcher.js \
                    src/lib/events/Publisher.js \
                    src/lib/events/Event.js \
                    src/lib/Template.js \
                    src/framework/views/BaseView.js \
                    src/lib/BaseView/Forms.js \
                    src/framework/models/BaseModel.js \
                    src/framework/models/BaseCollection.js \
                    src/lib/BaseModel/Publisher.js \
                    src/lib/BaseModel/BasicValidation.js \
                    src/lib/BaseModel/ExtendedValidation.js \
                    src/lib/BaseModel/Serialization.js \
                    src/lib/BaseModel/Serialization/Json.js \
                    src/lib/BaseModel/Serialization/QueryString.js \
                    src/lib/BaseModel/Persistence.js \
                    src/lib/BaseModel/Persistence/RestClient.js \
                    src/lib/BaseModel/Persistence/LocalStorage.js \
                    src/lib/BaseModel/TemplateDataKeys.js \
                    src/framework/operations/BaseOperation.js \
                    src/framework/operations/BootOperation.js \
                    src/framework/operations/InitOperation.js \
                    src/framework/operations/SubOperation.js \
                    src/framework/application/Application.js
do
  echo "Packing $source_file"
  (echo "/* File: $source_file */" && cat $source_file && echo "") >> $package_file_name
done

echo "Finishing packing files into $package_file_name"

exit $?

